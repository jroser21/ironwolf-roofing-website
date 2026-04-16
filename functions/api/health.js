import { jsonResponse } from './_shared.js';

export async function onRequestGet() {
  return jsonResponse({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
}
