import { getSettings } from './db.mjs';

export async function verifyAdmin(adminPassword) {
  const settings = await getSettings();
  return settings.admin_password && adminPassword === settings.admin_password;
}
