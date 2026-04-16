export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function notifyNewLead(env, lead) {
  if (!env.SENDGRID_API_KEY) return;

  const htmlBody = `<h2>New Inspection Request</h2>
<table style="border-collapse:collapse;font-family:sans-serif;">
  <tr><td style="padding:8px;font-weight:bold;">Name</td><td style="padding:8px;">${lead.first_name} ${lead.last_name}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;"><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>
  <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
  <tr><td style="padding:8px;font-weight:bold;">Address</td><td style="padding:8px;">${lead.address || '(not provided)'}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;">Reason</td><td style="padding:8px;">${lead.message || '(not provided)'}</td></tr>
</table>`;

  try {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: env.EMAIL_TO || 'info@ironwolfroofing.com' }] }],
        from: { email: env.EMAIL_FROM || 'info@ironwolfroofing.com', name: 'Ironwolf Roofing' },
        subject: `New Lead: ${lead.first_name} ${lead.last_name}`,
        content: [
          { type: 'text/plain', value: `New lead: ${lead.first_name} ${lead.last_name}\nPhone: ${lead.phone}\nEmail: ${lead.email}\nAddress: ${lead.address || 'N/A'}\nReason: ${lead.message || 'N/A'}` },
          { type: 'text/html', value: htmlBody },
        ],
      }),
    });
    if (!res.ok) {
      console.error('SendGrid error:', res.status, await res.text());
    }
  } catch (err) {
    console.error('Failed to send email:', err.message);
  }
}
