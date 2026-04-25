/**
 * @param {string} value
 * @returns {boolean}
 */
export function isValidHttpOrHttpsUrl(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) {
    return false;
  }
  try {
    const u = new URL(trimmed);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * @param {{ company?: string, role?: string, url?: string, date_applied?: string }} fields
 * @returns {Record<string, string>}
 */
export function validateJobFormFields(fields) {
  const errors = {};
  if (!(fields.company || '').trim()) {
    errors.company = 'Company name is required.';
  }
  if (!(fields.role || '').trim()) {
    errors.role = 'Role is required.';
  }
  const url = (fields.url || '').trim();
  if (!url) {
    errors.url = 'Job posting URL is required.';
  } else if (!isValidHttpOrHttpsUrl(url)) {
    errors.url = 'Enter a valid http(s) URL.';
  }
  if (!(fields.date_applied || '').trim()) {
    errors.date_applied = 'Date applied is required.';
  }
  return errors;
}
