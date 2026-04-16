import { jsonResponse } from '../_shared.js';

export async function onRequestGet(context) {
  const db = context.env.DB;
  const id = context.params.id;
  try {
    const lead = await db.prepare('SELECT * FROM leads WHERE id = ?').bind(id).first();
    if (!lead) return jsonResponse({ success: false, error: 'Lead not found' }, 404);
    return jsonResponse({ success: true, lead });
  } catch (error) {
    return jsonResponse({ success: false, error: 'Failed to fetch lead' }, 500);
  }
}

export async function onRequestPut(context) {
  const db = context.env.DB;
  const id = context.params.id;
  try {
    const { status } = await context.request.json();
    const validStatuses = ['new', 'contacted', 'quoted', 'scheduled', 'completed', 'lost'];

    if (!validStatuses.includes(status)) {
      return jsonResponse({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, 400);
    }

    const result = await db.prepare(
      'UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(status, id).run();

    if (!result.meta.changes) return jsonResponse({ success: false, error: 'Lead not found' }, 404);
    return jsonResponse({ success: true, message: 'Lead updated successfully' });
  } catch (error) {
    return jsonResponse({ success: false, error: 'Failed to update lead' }, 500);
  }
}

export async function onRequestDelete(context) {
  const db = context.env.DB;
  const id = context.params.id;
  try {
    const result = await db.prepare('DELETE FROM leads WHERE id = ?').bind(id).run();
    if (!result.meta.changes) return jsonResponse({ success: false, error: 'Lead not found' }, 404);
    return jsonResponse({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    return jsonResponse({ success: false, error: 'Failed to delete lead' }, 500);
  }
}
