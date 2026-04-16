import { jsonResponse } from './_shared.js';

export async function onRequestGet(context) {
  const db = context.env.DB;
  try {
    const totalLeads = (await db.prepare('SELECT COUNT(*) as count FROM leads').first()).count;
    const newLeads = (await db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'new'").first()).count;
    const totalEstimates = (await db.prepare('SELECT COUNT(*) as count FROM estimates').first()).count;

    const { results: leadsByStatus } = await db.prepare(
      'SELECT status, COUNT(*) as count FROM leads GROUP BY status'
    ).all();

    const { results: recentLeads } = await db.prepare(
      'SELECT id, first_name, last_name, email, service, status, created_at FROM leads ORDER BY created_at DESC LIMIT 5'
    ).all();

    return jsonResponse({
      success: true,
      stats: { totalLeads, newLeads, totalEstimates, leadsByStatus, recentLeads },
    });
  } catch (error) {
    return jsonResponse({ success: false, error: 'Failed to fetch stats' }, 500);
  }
}
