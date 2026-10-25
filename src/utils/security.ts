/**
 * Input sanitization, validation, and security utilities.
 */

export interface WishValidationResult {
  valid: boolean;
  error?: string;
  sanitizedName?: string;
  sanitizedMessage?: string;
}

/**
 * Strips dangerous HTML tags and script elements, escaping special HTML characters
 * to eliminate Cross-Site Scripting (XSS) risks.
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Strip dangerous event handler attributes and javascript: pseudo-protocols
  let cleaned = input
    .replace(/on\w+\s*=/gi, '')
    .replace(/javascript\s*:/gi, '');

  // Escape HTML special characters so browser never evaluates tags
  cleaned = cleaned
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();

  return cleaned;
}

/**
 * Validates a guest wish submission.
 * Enforces character limits, non-empty text, and sanitizes input.
 */
export function validateWish(name: unknown, message: unknown): WishValidationResult {
  if (typeof name !== 'string' || !name.trim()) {
    return { valid: false, error: 'Name is required' };
  }

  const cleanName = name.trim();
  if (cleanName.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters long' };
  }
  if (cleanName.length > 50) {
    return { valid: false, error: 'Name must not exceed 50 characters' };
  }

  if (typeof message !== 'string' || !message.trim()) {
    return { valid: false, error: 'Birthday message is required' };
  }

  const cleanMessage = message.trim();
  if (cleanMessage.length < 5) {
    return { valid: false, error: 'Message must be at least 5 characters long' };
  }
  if (cleanMessage.length > 600) {
    return { valid: false, error: 'Message must not exceed 600 characters' };
  }

  return {
    valid: true,
    sanitizedName: sanitizeHtml(cleanName),
    sanitizedMessage: sanitizeHtml(cleanMessage),
  };
}
