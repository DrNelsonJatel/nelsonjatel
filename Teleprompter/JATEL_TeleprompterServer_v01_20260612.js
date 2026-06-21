#!/usr/bin/env node
/*
  JATEL Teleprompter Server v01 (2026-06-12)
  Zero-dependency local teleprompter for iPad mini 2 (iOS 12 Safari)
  controlled from a laptop browser on the same Wi-Fi network.

  Run:    node JATEL_TeleprompterServer_v01_20260612.js
  iPad:   open http://<mac-ip>:8420/        (prompter, goes behind the glass)
  Mac:    open http://localhost:8420/control (controller)

  Design notes:
  - The iPad page is written in strict ES5 with XHR polling. No fetch,
    no arrow functions, no optional chaining. This is deliberate: the
    target engine is Safari 12 era WebKit.
  - State lives in this process. Controller POSTs changes, prompter
    polls every 250 ms. Latency is well under half a second, which is
    fine for scroll transport control.
*/

'use strict';

var http = require('http');
var os = require('os');

var PORT = 8420;

/* ------------------------------------------------------------------ */
/* Shared state                                                        */
/* ------------------------------------------------------------------ */

var state = {
  rev: 1,                /* bumps on every change; prompter re-syncs   */
  script: 'Welcome to your teleprompter.\n\nPaste your script in the controller on your laptop and press Send to prompter.\n\nSpace bar starts and stops the scroll.',
  playing: false,
  speed: 90,             /* pixels per second                          */
  fontSize: 56,          /* px                                          */
  mirrorH: true,         /* horizontal flip for beamsplitter glass     */
  mirrorV: false,        /* vertical flip for ceiling mounts           */
  resetSeq: 0            /* bump to send the prompter back to the top  */
};

var lastPromptPoll = 0;  /* ms epoch of the prompter's last poll       */

/* ------------------------------------------------------------------ */
/* Prompter page (iPad, iOS 12 Safari, strict ES5)                     */
/* ------------------------------------------------------------------ */

var PROMPTER_HTML = '<!DOCTYPE html>\n' +
'<html><head>\n' +
'<meta charset="utf-8">\n' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n' +
'<meta name="apple-mobile-web-app-capable" content="yes">\n' +
'<meta name="apple-mobile-web-app-status-bar-style" content="black">\n' +
'<title>Prompter</title>\n' +
'<style>\n' +
'  html, body { margin:0; padding:0; background:#000; height:100%; overflow:hidden;\n' +
'    -webkit-user-select:none; -webkit-touch-callout:none; }\n' +
'  #stage { position:fixed; top:0; left:0; right:0; bottom:0; overflow:hidden; }\n' +
'  #flip  { position:absolute; top:0; left:0; right:0; bottom:0; }\n' +
'  #scroller { position:absolute; left:0; right:0; top:0;\n' +
'    padding:50vh 6vw 60vh 6vw;\n' +
'    -webkit-transform:translate3d(0,0,0); }\n' +
'  #scriptText { color:#fff;\n' +
'    font-family:-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif;\n' +
'    font-weight:600; line-height:1.42; white-space:pre-wrap;\n' +
'    word-wrap:break-word; text-align:left; }\n' +
'  #cueline { position:absolute; left:0; right:0; top:38%; height:0;\n' +
'    border-top:1px solid rgba(255,179,71,0.35); pointer-events:none; }\n' +
'  #tally { position:absolute; top:12px; left:12px; width:10px; height:10px;\n' +
'    border-radius:50%; background:#5a5a5a; }\n' +
'  #tally.rolling { background:#e03b2f; }\n' +
'  #tally.standby { background:#ffb347; }\n' +
'  #msg { position:absolute; bottom:14px; left:0; right:0; text-align:center;\n' +
'    color:#6f6f6f; font-family:Menlo, monospace; font-size:13px; }\n' +
'</style>\n' +
'</head><body>\n' +
'<div id="stage">\n' +
'  <div id="flip">\n' +
'    <div id="scroller"><div id="scriptText"></div></div>\n' +
'    <div id="cueline"></div>\n' +
'  </div>\n' +
'  <div id="tally"></div>\n' +
'  <div id="msg">connecting to controller...</div>\n' +
'</div>\n' +
'<script>\n' +
'(function () {\n' +
'  "use strict";\n' +
'  var scroller   = document.getElementById("scroller");\n' +
'  var scriptText = document.getElementById("scriptText");\n' +
'  var flip       = document.getElementById("flip");\n' +
'  var tally      = document.getElementById("tally");\n' +
'  var msg        = document.getElementById("msg");\n' +
'\n' +
'  var rev = 0, resetSeq = 0;\n' +
'  var playing = false, speed = 90;\n' +
'  var y = 0, lastT = 0, lastOk = 0;\n' +
'\n' +
'  function applyState(s) {\n' +
'    if (s.rev !== rev) {\n' +
'      rev = s.rev;\n' +
'      if (scriptText.textContent !== undefined) {\n' +
'        if (scriptText.textContent !== s.script) scriptText.textContent = s.script;\n' +
'      } else if (scriptText.innerText !== s.script) {\n' +
'        scriptText.innerText = s.script;\n' +
'      }\n' +
'      scriptText.style.fontSize = s.fontSize + "px";\n' +
'      var tx = s.mirrorH ? -1 : 1;\n' +
'      var ty = s.mirrorV ? -1 : 1;\n' +
'      flip.style.webkitTransform = "scale(" + tx + "," + ty + ")";\n' +
'      flip.style.transform = "scale(" + tx + "," + ty + ")";\n' +
'      speed = s.speed;\n' +
'      playing = s.playing;\n' +
'      if (s.resetSeq !== resetSeq) { resetSeq = s.resetSeq; y = 0; }\n' +
'      tally.className = playing ? "rolling" : "standby";\n' +
'      msg.style.display = "none";\n' +
'    } else {\n' +
'      /* rev unchanged but transport may differ */\n' +
'      playing = s.playing; speed = s.speed;\n' +
'      if (s.resetSeq !== resetSeq) { resetSeq = s.resetSeq; y = 0; }\n' +
'      tally.className = playing ? "rolling" : "standby";\n' +
'    }\n' +
'  }\n' +
'\n' +
'  function poll() {\n' +
'    var xhr = new XMLHttpRequest();\n' +
'    xhr.open("GET", "/state?who=prompter&_=" + Date.now(), true);\n' +
'    xhr.onreadystatechange = function () {\n' +
'      if (xhr.readyState !== 4) return;\n' +
'      if (xhr.status === 200) {\n' +
'        lastOk = Date.now();\n' +
'        try { applyState(JSON.parse(xhr.responseText)); } catch (e) {}\n' +
'      }\n' +
'      if (Date.now() - lastOk > 4000) {\n' +
'        tally.className = "";\n' +
'        msg.style.display = "block";\n' +
'        msg.textContent = "controller link lost, retrying...";\n' +
'      }\n' +
'    };\n' +
'    xhr.send();\n' +
'  }\n' +
'  setInterval(poll, 250);\n' +
'  poll();\n' +
'\n' +
'  /* Scroll engine: requestAnimationFrame with translate3d for GPU. */\n' +
'  function frame(t) {\n' +
'    if (!lastT) lastT = t;\n' +
'    var dt = (t - lastT) / 1000;\n' +
'    lastT = t;\n' +
'    if (playing) {\n' +
'      y += speed * dt;\n' +
'      var max = scroller.offsetHeight - window.innerHeight * 0.2;\n' +
'      if (y > max) { y = max; playing = false; }\n' +
'      scroller.style.webkitTransform = "translate3d(0," + (-y) + "px,0)";\n' +
'      scroller.style.transform = "translate3d(0," + (-y) + "px,0)";\n' +
'    }\n' +
'    window.requestAnimationFrame(frame);\n' +
'  }\n' +
'  window.requestAnimationFrame(frame);\n' +
'\n' +
'  /* Local fallback: tap toggles play state via the server so the     */\n' +
'  /* controller stays in sync.                                        */\n' +
'  document.body.addEventListener("touchend", function () {\n' +
'    var xhr = new XMLHttpRequest();\n' +
'    xhr.open("POST", "/update", true);\n' +
'    xhr.setRequestHeader("Content-Type", "application/json");\n' +
'    xhr.send(JSON.stringify({ playing: !playing }));\n' +
'  });\n' +
'})();\n' +
'</script>\n' +
'</body></html>\n';

/* ------------------------------------------------------------------ */
/* Controller page (laptop, modern browser)                            */
/* ------------------------------------------------------------------ */

var CONTROLLER_HTML = '<!DOCTYPE html>\n' +
'<html><head>\n' +
'<meta charset="utf-8">\n' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'<title>Prompter Control</title>\n' +
'<style>\n' +
'  :root { --bg:#15181c; --panel:#1d2127; --line:#2c323b; --ink:#e8e6e1;\n' +
'          --dim:#8a9099; --amber:#ffb347; --red:#e03b2f; }\n' +
'  * { box-sizing:border-box; }\n' +
'  body { margin:0; background:var(--bg); color:var(--ink);\n' +
'    font-family:-apple-system, "Helvetica Neue", sans-serif; }\n' +
'  header { display:flex; align-items:center; padding:14px 22px;\n' +
'    border-bottom:1px solid var(--line); }\n' +
'  header h1 { font-size:14px; font-weight:600; letter-spacing:0.12em;\n' +
'    text-transform:uppercase; margin:0; color:var(--dim); }\n' +
'  #tally { width:11px; height:11px; border-radius:50%; background:#555;\n' +
'    margin-right:12px; }\n' +
'  #tally.rolling { background:var(--red); box-shadow:0 0 8px var(--red); }\n' +
'  #tally.standby { background:var(--amber); }\n' +
'  #linkstate { margin-left:auto; font-family:Menlo, monospace;\n' +
'    font-size:12px; color:var(--dim); }\n' +
'  main { display:flex; height:calc(100vh - 49px); }\n' +
'  #left { flex:1.4; display:flex; flex-direction:column; padding:18px;\n' +
'    border-right:1px solid var(--line); }\n' +
'  #script { flex:1; background:var(--panel); color:var(--ink);\n' +
'    border:1px solid var(--line); border-radius:6px; padding:14px;\n' +
'    font-size:15px; line-height:1.5; resize:none; outline:none; }\n' +
'  #left button { margin-top:12px; }\n' +
'  #right { flex:1; padding:18px 22px; overflow-y:auto; }\n' +
'  .grp { margin-bottom:26px; }\n' +
'  .grp label { display:block; font-family:Menlo, monospace; font-size:11px;\n' +
'    letter-spacing:0.1em; text-transform:uppercase; color:var(--dim);\n' +
'    margin-bottom:8px; }\n' +
'  button { background:var(--panel); color:var(--ink);\n' +
'    border:1px solid var(--line); border-radius:6px; padding:10px 18px;\n' +
'    font-size:14px; cursor:pointer; }\n' +
'  button:hover { border-color:var(--dim); }\n' +
'  button.primary { background:var(--amber); border-color:var(--amber);\n' +
'    color:#1a1a1a; font-weight:600; }\n' +
'  button.big { font-size:17px; padding:14px 26px; width:100%; }\n' +
'  input[type=range] { width:100%; }\n' +
'  .val { font-family:Menlo, monospace; font-size:12px; color:var(--amber); }\n' +
'  .row { display:flex; }\n' +
'  .row > * { margin-right:10px; }\n' +
'  .keys { font-family:Menlo, monospace; font-size:12px; color:var(--dim);\n' +
'    line-height:1.9; }\n' +
'  kbd { background:var(--panel); border:1px solid var(--line);\n' +
'    border-radius:4px; padding:1px 6px; }\n' +
'</style>\n' +
'</head><body>\n' +
'<header>\n' +
'  <div id="tally"></div>\n' +
'  <h1>Prompter Control</h1>\n' +
'  <div id="linkstate">prompter: waiting</div>\n' +
'</header>\n' +
'<main>\n' +
'  <div id="left">\n' +
'    <textarea id="script" spellcheck="false"></textarea>\n' +
'    <button class="primary" id="send">Send to prompter</button>\n' +
'  </div>\n' +
'  <div id="right">\n' +
'    <div class="grp">\n' +
'      <button class="big primary" id="playpause">Roll</button>\n' +
'    </div>\n' +
'    <div class="grp">\n' +
'      <div class="row"><button id="restart">Back to top</button></div>\n' +
'    </div>\n' +
'    <div class="grp">\n' +
'      <label>Speed <span class="val" id="speedval"></span></label>\n' +
'      <input type="range" id="speed" min="20" max="300" step="5">\n' +
'    </div>\n' +
'    <div class="grp">\n' +
'      <label>Font size <span class="val" id="fontval"></span></label>\n' +
'      <input type="range" id="font" min="28" max="120" step="2">\n' +
'    </div>\n' +
'    <div class="grp">\n' +
'      <label>Mirror</label>\n' +
'      <div class="row">\n' +
'        <button id="mh">Horizontal: on</button>\n' +
'        <button id="mv">Vertical: off</button>\n' +
'      </div>\n' +
'    </div>\n' +
'    <div class="grp keys">\n' +
'      <label>Keys</label>\n' +
'      <kbd>Space</kbd> roll / hold &nbsp; <kbd>R</kbd> back to top<br>\n' +
'      <kbd>&larr;</kbd><kbd>&rarr;</kbd> speed &nbsp;\n' +
'      <kbd>&uarr;</kbd><kbd>&darr;</kbd> font size<br>\n' +
'      (click outside the script box first)\n' +
'    </div>\n' +
'  </div>\n' +
'</main>\n' +
'<script>\n' +
'(function () {\n' +
'  "use strict";\n' +
'  var S = null;\n' +
'  var els = {\n' +
'    tally: document.getElementById("tally"),\n' +
'    link: document.getElementById("linkstate"),\n' +
'    script: document.getElementById("script"),\n' +
'    send: document.getElementById("send"),\n' +
'    play: document.getElementById("playpause"),\n' +
'    restart: document.getElementById("restart"),\n' +
'    speed: document.getElementById("speed"),\n' +
'    speedval: document.getElementById("speedval"),\n' +
'    font: document.getElementById("font"),\n' +
'    fontval: document.getElementById("fontval"),\n' +
'    mh: document.getElementById("mh"),\n' +
'    mv: document.getElementById("mv")\n' +
'  };\n' +
'\n' +
'  function post(patch) {\n' +
'    var xhr = new XMLHttpRequest();\n' +
'    xhr.open("POST", "/update", true);\n' +
'    xhr.setRequestHeader("Content-Type", "application/json");\n' +
'    xhr.send(JSON.stringify(patch));\n' +
'  }\n' +
'\n' +
'  function render() {\n' +
'    if (!S) return;\n' +
'    els.tally.className = S.playing ? "rolling" : "standby";\n' +
'    els.play.textContent = S.playing ? "Hold" : "Roll";\n' +
'    els.speed.value = S.speed; els.speedval.textContent = S.speed + " px/s";\n' +
'    els.font.value = S.fontSize; els.fontval.textContent = S.fontSize + " px";\n' +
'    els.mh.textContent = "Horizontal: " + (S.mirrorH ? "on" : "off");\n' +
'    els.mv.textContent = "Vertical: " + (S.mirrorV ? "on" : "off");\n' +
'    var age = S.promptAge;\n' +
'    els.link.textContent = (age >= 0 && age < 3000)\n' +
'      ? "prompter: connected" : "prompter: not connected";\n' +
'    els.link.style.color = (age >= 0 && age < 3000) ? "#7fbf7f" : "#c96f6f";\n' +
'  }\n' +
'\n' +
'  var seededScript = false;\n' +
'  function poll() {\n' +
'    var xhr = new XMLHttpRequest();\n' +
'    xhr.open("GET", "/state?who=controller&_=" + Date.now(), true);\n' +
'    xhr.onreadystatechange = function () {\n' +
'      if (xhr.readyState !== 4 || xhr.status !== 200) return;\n' +
'      try { S = JSON.parse(xhr.responseText); } catch (e) { return; }\n' +
'      if (!seededScript) { els.script.value = S.script; seededScript = true; }\n' +
'      render();\n' +
'    };\n' +
'    xhr.send();\n' +
'  }\n' +
'  setInterval(poll, 500);\n' +
'  poll();\n' +
'\n' +
'  els.send.onclick = function () { post({ script: els.script.value, reset: true }); };\n' +
'  els.play.onclick = function () { if (S) post({ playing: !S.playing }); };\n' +
'  els.restart.onclick = function () { post({ reset: true, playing: false }); };\n' +
'  els.speed.oninput = function () { post({ speed: Number(els.speed.value) }); };\n' +
'  els.font.oninput = function () { post({ fontSize: Number(els.font.value) }); };\n' +
'  els.mh.onclick = function () { if (S) post({ mirrorH: !S.mirrorH }); };\n' +
'  els.mv.onclick = function () { if (S) post({ mirrorV: !S.mirrorV }); };\n' +
'\n' +
'  document.addEventListener("keydown", function (e) {\n' +
'    if (document.activeElement === els.script) return;\n' +
'    if (!S) return;\n' +
'    if (e.code === "Space") { e.preventDefault(); post({ playing: !S.playing }); }\n' +
'    else if (e.key === "r" || e.key === "R") post({ reset: true, playing: false });\n' +
'    else if (e.key === "ArrowRight") post({ speed: Math.min(300, S.speed + 5) });\n' +
'    else if (e.key === "ArrowLeft")  post({ speed: Math.max(20,  S.speed - 5) });\n' +
'    else if (e.key === "ArrowUp")    post({ fontSize: Math.min(120, S.fontSize + 2) });\n' +
'    else if (e.key === "ArrowDown")  post({ fontSize: Math.max(28,  S.fontSize - 2) });\n' +
'  });\n' +
'})();\n' +
'</script>\n' +
'</body></html>\n';

/* ------------------------------------------------------------------ */
/* HTTP server                                                         */
/* ------------------------------------------------------------------ */

function sendJSON(res, obj) {
  var body = JSON.stringify(obj);
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function sendHTML(res, html) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(html);
}

var server = http.createServer(function (req, res) {
  var url = req.url.split('?')[0];

  if (req.method === 'GET' && (url === '/' || url === '/prompter')) {
    return sendHTML(res, PROMPTER_HTML);
  }

  if (req.method === 'GET' && url === '/control') {
    return sendHTML(res, CONTROLLER_HTML);
  }

  if (req.method === 'GET' && url === '/state') {
    if (req.url.indexOf('who=prompter') !== -1) lastPromptPoll = Date.now();
    var out = {
      rev: state.rev, script: state.script, playing: state.playing,
      speed: state.speed, fontSize: state.fontSize,
      mirrorH: state.mirrorH, mirrorV: state.mirrorV,
      resetSeq: state.resetSeq,
      promptAge: lastPromptPoll ? (Date.now() - lastPromptPoll) : -1
    };
    return sendJSON(res, out);
  }

  if (req.method === 'POST' && url === '/update') {
    var chunks = [];
    req.on('data', function (c) { chunks.push(c); });
    req.on('end', function () {
      var patch;
      try { patch = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
      catch (e) { res.writeHead(400); return res.end('bad json'); }

      var contentChanged = false;
      if (typeof patch.script === 'string')   { state.script = patch.script; contentChanged = true; }
      if (typeof patch.playing === 'boolean') { state.playing = patch.playing; }
      if (typeof patch.speed === 'number')    { state.speed = clamp(patch.speed, 20, 300); }
      if (typeof patch.fontSize === 'number') { state.fontSize = clamp(patch.fontSize, 28, 120); contentChanged = true; }
      if (typeof patch.mirrorH === 'boolean') { state.mirrorH = patch.mirrorH; contentChanged = true; }
      if (typeof patch.mirrorV === 'boolean') { state.mirrorV = patch.mirrorV; contentChanged = true; }
      if (patch.reset === true)               { state.resetSeq += 1; }
      if (contentChanged) state.rev += 1;

      return sendJSON(res, { ok: true, rev: state.rev });
    });
    return;
  }

  res.writeHead(404);
  res.end('not found');
});

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

/* ------------------------------------------------------------------ */
/* Startup with QAQC self-check                                        */
/* ------------------------------------------------------------------ */

function lanAddresses() {
  var out = [];
  var ifaces = os.networkInterfaces();
  Object.keys(ifaces).forEach(function (name) {
    (ifaces[name] || []).forEach(function (a) {
      if (a.family === 'IPv4' && !a.internal) out.push(a.address);
    });
  });
  return out;
}

server.on('error', function (err) {
  if (err.code === 'EADDRINUSE') {
    console.error('[QAQC FAIL] Port ' + PORT + ' is already in use.');
    console.error('  Fix: close the other process or change PORT at the top of this file.');
  } else {
    console.error('[QAQC FAIL] Server error: ' + err.message);
  }
  process.exit(1);
});

server.listen(PORT, function () {
  var nodeMajor = parseInt(process.versions.node.split('.')[0], 10);
  var ips = lanAddresses();

  console.log('');
  console.log('  JATEL Teleprompter Server v01');
  console.log('  ------------------------------------------');
  console.log('  [QAQC] Node version ' + process.versions.node +
              (nodeMajor >= 12 ? '  ok' : '  WARNING: Node 12+ recommended'));
  console.log('  [QAQC] Port ' + PORT + ' bound  ok');
  console.log('  [QAQC] LAN interfaces found: ' + (ips.length || 'none') +
              (ips.length ? '  ok' : '  WARNING: no Wi-Fi address detected'));
  console.log('');
  console.log('  Controller (this Mac):  http://localhost:' + PORT + '/control');
  if (ips.length) {
    ips.forEach(function (ip) {
      console.log('  Prompter (iPad):        http://' + ip + ':' + PORT + '/');
    });
  } else {
    console.log('  Prompter (iPad):        connect Mac to Wi-Fi, then restart');
  }
  console.log('');
  console.log('  Both devices must be on the same Wi-Fi network.');
  console.log('  Stop with Ctrl+C.');
  console.log('');
});
