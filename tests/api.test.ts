import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { validateWish, sanitizeHtml } from '../src/utils/security';

test('validateWish handles edge-case character counts correctly', () => {
  // Test minimum length boundary
  assert.equal(validateWish('A', 'Happy Birthday Lalee!').valid, false);
  assert.equal(validateWish('Al', 'Happy Birthday Lalee!').valid, true);

  // Test maximum length boundary
  const longName = 'A'.repeat(50);
  assert.equal(validateWish(longName, 'Happy Birthday Lalee!').valid, true);
  const tooLongName = 'A'.repeat(51);
  assert.equal(validateWish(tooLongName, 'Happy Birthday Lalee!').valid, false);

  // Test message boundaries
  assert.equal(validateWish('Sneha', '1234').valid, false);
  assert.equal(validateWish('Sneha', '12345').valid, true);
  const maxMessage = 'M'.repeat(600);
  assert.equal(validateWish('Sneha', maxMessage).valid, true);
  const tooLongMessage = 'M'.repeat(601);
  assert.equal(validateWish('Sneha', tooLongMessage).valid, false);
});

test('sanitizeHtml removes XSS payloads safely', () => {
  const xssExamples = [
    '<script>alert("xss")</script>',
    '<img src="x" onerror="stealCookie()" />',
    '"><script src="attacker.com"></script>',
    '<b onmouseover=alert(1)>bold</b>',
  ];

  for (const ex of xssExamples) {
    const clean = sanitizeHtml(ex);
    assert.equal(clean.includes('<script>'), false);
    assert.equal(clean.includes('onerror='), false);
    assert.equal(clean.includes('onmouseover='), false);
  }
});

test('timingSafeEqual behaves correctly for password validation', () => {
  const correct = 'lalee2026';
  const targetBuffer = Buffer.from(correct);

  const inputMatch = Buffer.from('lalee2026');
  assert.equal(
    inputMatch.length === targetBuffer.length &&
    crypto.timingSafeEqual(inputMatch, targetBuffer),
    true
  );

  const inputFail = Buffer.from('wrongpass');
  assert.equal(
    inputFail.length === targetBuffer.length &&
    crypto.timingSafeEqual(inputFail, targetBuffer),
    false
  );
});
