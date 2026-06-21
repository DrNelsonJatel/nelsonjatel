// Client-side newsletter (The Signal) subscribe + confirm/unsubscribe.
// Subscribe inserts a pending row into Supabase `subscribers` via the
// insert-only publishable key; a database trigger then emails a confirmation
// link (double opt-in). Confirm/unsubscribe call SECURITY DEFINER RPCs that
// act only on the row matching the random token in the link.
//
// Markup contract:
//   <form data-newsletter> with name="email", optional honeypot name="_gotcha",
//   and a [data-status] element for live messages.

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.PUBLIC_SUPABASE_KEY as string | undefined;

function headers() {
  return {
    apikey: SUPABASE_KEY as string,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  };
}

function field(form: HTMLFormElement, name: string): string {
  const el = form.elements.namedItem(name) as HTMLInputElement | null;
  return el?.value?.trim() ?? '';
}

async function subscribe(form: HTMLFormElement) {
  const status = form.querySelector<HTMLElement>('[data-status]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const setStatus = (msg: string, kind: 'info' | 'error' | 'ok') => {
    if (status) { status.textContent = msg; status.dataset.kind = kind; }
  };

  if (field(form, '_gotcha')) {
    form.innerHTML = '<p data-status data-kind="ok">Almost there. Check your inbox to confirm.</p>';
    return;
  }

  const email = field(form, 'email').toLowerCase();
  if (!email || !email.includes('@') || !email.includes('.')) {
    setStatus('Please enter a valid email.', 'error');
    return;
  }
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    setStatus('Sorry, signup is not available right now. Please email hello@nelsonjatel.com.', 'error');
    return;
  }

  if (button) button.disabled = true;
  setStatus('Subscribing…', 'info');

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
      method: 'POST',
      headers: { ...headers(), Prefer: 'return=minimal' },
      body: JSON.stringify({ email, source: window.location.pathname }),
    });
    // 409 = already on the list (unique email). Treat as a soft success.
    if (res.status === 409) {
      form.innerHTML = '<p data-status data-kind="ok">You are already on the list. If you have not confirmed yet, check your inbox.</p>';
      return;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    form.innerHTML = '<p data-status data-kind="ok">Almost there. I have sent you a confirmation link, please open it to finish subscribing.</p>';
  } catch {
    if (button) button.disabled = false;
    setStatus('Something went wrong. Please try again, or email hello@nelsonjatel.com.', 'error');
  }
}

export function initNewsletterForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-newsletter]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      void subscribe(form);
    });
  });
}

// Calls a token RPC (confirm_subscription / unsubscribe_subscription) and
// returns the function's text result, or 'error' on failure.
async function callTokenRpc(fn: string, token: string): Promise<string> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return 'error';
  if (!token) return 'invalid';
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ p_token: token }),
    });
    if (!res.ok) return 'error';
    return (await res.json()) as string;
  } catch {
    return 'error';
  }
}

const tokenFromUrl = () => new URLSearchParams(window.location.search).get('token') ?? '';

export async function runConfirm(): Promise<string> {
  return callTokenRpc('confirm_subscription', tokenFromUrl());
}

export async function runUnsubscribe(): Promise<string> {
  return callTokenRpc('unsubscribe_subscription', tokenFromUrl());
}
