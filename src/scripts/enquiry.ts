// Client-side enquiry submit: inserts booking + contact form data into the
// Supabase `enquiries` table, the same client-insert pattern as the Thresan
// site. The publishable key is insert-only via RLS, so exposing it is safe.
//
// Markup contract (see speaking.astro / contact.astro):
//   <form data-enquiry data-kind="booking|contact"> ... </form>
//   a [data-status] element inside the form for live messages.
//   an optional honeypot input name="_gotcha".

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.PUBLIC_SUPABASE_KEY as string | undefined;

function field(form: HTMLFormElement, name: string): string {
  const el = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
  return el?.value?.trim() ?? '';
}

async function submit(form: HTMLFormElement) {
  const status = form.querySelector<HTMLElement>('[data-status]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const setStatus = (msg: string, kind: 'info' | 'error' | 'ok') => {
    if (!status) return;
    status.textContent = msg;
    status.dataset.kind = kind;
  };

  // Honeypot: a filled hidden field means a bot. Pretend success, save nothing.
  if (field(form, '_gotcha')) {
    form.innerHTML = '<p data-status data-kind="ok">Thank you. I will reply within two business days.</p>';
    return;
  }

  const email = field(form, 'email');
  if (!email || !email.includes('@') || !email.includes('.')) {
    setStatus('Please enter a valid email.', 'error');
    return;
  }
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    setStatus(`Sorry, the form is not available right now. Please email hello@nelsonjatel.com.`, 'error');
    return;
  }

  if (button) { button.disabled = true; }
  setStatus('Sending…', 'info');

  const payload = {
    kind: form.dataset.kind === 'booking' ? 'booking' : 'contact',
    name: field(form, 'name'),
    email: email.toLowerCase(),
    organisation: field(form, 'organisation') || null,
    event_date: field(form, 'event_date') || null,
    message: field(form, 'detail') || field(form, 'message') || null,
    source: form.dataset.kind || 'contact',
    referrer: document.referrer || null,
    user_agent: navigator.userAgent,
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/enquiries`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    form.innerHTML =
      '<p data-status data-kind="ok">Thank you. Your message reached me and I will reply within two business days.</p>';
  } catch {
    if (button) { button.disabled = false; }
    setStatus('Something went wrong. Please try again, or email hello@nelsonjatel.com.', 'error');
  }
}

export function initEnquiryForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-enquiry]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      void submit(form);
    });
  });
}
