import { jsonResponse, notifyNewLead } from '../_shared.js';

export async function onRequestGet(context) {
  const db = context.env.DB;
  try {
    const { results } = await db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
    return jsonResponse({ success: true, count: results.length, leads: results });
  } catch (error) {
    return jsonResponse({ success: false, error: 'Failed to fetch leads' }, 500);
  }
}

export async function onRequestPost(context) {
  const db = context.env.DB;
  try {
    const { first_name, last_name, email, phone, address, service, message } = await context.request.json();

    if (!first_name || !last_name || !email || !phone) {
      return jsonResponse({ success: false, error: 'First name, last name, email, and phone are required' }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return jsonResponse({ success: false, error: 'Invalid email format' }, 400);
    }

    const result = await db.prepare(
      'INSERT INTO leads (first_name, last_name, email, phone, address, service, message) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(first_name, last_name, email, phone, address || null, service || null, message || null).run();

    const leadId = result.meta.last_row_id;

    context.waitUntil(notifyNewLead(context.env, {
      id: leadId, first_name, last_name, email, phone,
      address: address || null, message: message || null,
    }));

    return jsonResponse({ success: true, message: 'Lead submitted successfully', leadId }, 201);
  } catch (error) {
    return jsonResponse({ success: false, error: 'Failed to submit lead' }, 500);
  }
}
