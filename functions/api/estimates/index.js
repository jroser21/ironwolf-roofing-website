import { jsonResponse } from '../_shared.js';

export async function onRequestGet(context) {
  const db = context.env.DB;
  try {
    const { results } = await db.prepare('SELECT * FROM estimates ORDER BY created_at DESC').all();
    return jsonResponse({ success: true, count: results.length, estimates: results });
  } catch (error) {
    return jsonResponse({ success: false, error: 'Failed to fetch estimates' }, 500);
  }
}

export async function onRequestPost(context) {
  const db = context.env.DB;
  try {
    const {
      address, latitude, longitude, roof_area_sqft, roof_squares,
      num_facets, predominant_pitch, complexity, waste_factor,
      price_low, price_mid, price_high,
    } = await context.request.json();

    if (!address) {
      return jsonResponse({ success: false, error: 'Address is required' }, 400);
    }

    const result = await db.prepare(
      `INSERT INTO estimates (address, latitude, longitude, roof_area_sqft, roof_squares,
        num_facets, predominant_pitch, complexity, waste_factor, price_low, price_mid, price_high)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      address, latitude, longitude, roof_area_sqft, roof_squares,
      num_facets, predominant_pitch, complexity, waste_factor,
      price_low, price_mid, price_high
    ).run();

    return jsonResponse({
      success: true,
      message: 'Estimate saved successfully',
      estimateId: result.meta.last_row_id,
    }, 201);
  } catch (error) {
    return jsonResponse({ success: false, error: 'Failed to save estimate' }, 500);
  }
}
