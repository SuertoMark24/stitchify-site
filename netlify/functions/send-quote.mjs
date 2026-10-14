// Receives a quote from /internal/pricing.html and posts it to the owner's private Discord channel.
//
// The Discord webhook URL lives ONLY in a Netlify environment variable, never in the page — anyone
// holding it can post into that channel. Set in Netlify: Site configuration -> Environment
// variables -> DISCORD_QUOTE_WEBHOOK = https://discord.com/api/webhooks/...
//
// Totals are computed in the customer's browser, so treat them as "what the customer saw", not as
// a price you are bound by — check against the real price list before confirming.

const LIMITS = { name: 80, contact: 120, message: 1000, plan: 40, billing: 20, addons: 400, total: 40, summary: 2000 };

const clean = (v, max) => String(v ?? '').replace(/\u0000/g, '').trim().slice(0, max);

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  let body;
  try { body = await req.json(); } catch { return json({ ok: false, error: 'Bad request' }, 400); }

  // Honeypot: real visitors never fill this hidden field. Pretend success so bots learn nothing.
  if (clean(body['bot-field'], 50)) return json({ ok: true });

  const q = Object.fromEntries(Object.entries(LIMITS).map(([k, max]) => [k, clean(body[k], max)]));
  if (!q.name || !q.contact) return json({ ok: false, error: 'Name and contact are required.' }, 400);
  if (body.acceptedTerms !== true) return json({ ok: false, error: 'The terms must be accepted.' }, 400);

  const hook = process.env.DISCORD_QUOTE_WEBHOOK;
  if (!hook || !/^https:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/api\/webhooks\//.test(hook)) {
    return json({ ok: false, error: 'Quotes are not set up yet.' }, 503);
  }

  const payload = {
    username: 'Stitchify Pro Quotes',
    allowed_mentions: { parse: [] },           // never let customer text ping @everyone
    embeds: [{
      title: `New quote: ${q.plan || '?'} (${q.billing || '?'}) — ${q.total || '?'}`,
      color: 0xff7a18,
      description: '```\n' + (q.summary || '(no summary)').replace(/```/g, "'''") + '\n```',
      fields: [
        { name: 'Name', value: q.name, inline: true },
        { name: 'Contact', value: q.contact, inline: true },
        { name: 'Add-ons', value: q.addons || 'None' },
        ...(q.message ? [{ name: 'Message', value: q.message }] : []),
        { name: 'Terms', value: 'Accepted Terms & Contract and the risks page' },
      ],
      timestamp: new Date().toISOString(),
    }],
  };

  try {
    const res = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) return json({ ok: false, error: 'Could not deliver the quote.' }, 502);
  } catch {
    return json({ ok: false, error: 'Could not deliver the quote.' }, 502);
  }
  return json({ ok: true });
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const config = { path: '/api/send-quote' };
