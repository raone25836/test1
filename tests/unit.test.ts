import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBirthdayCountdown, isLeapYear, getZonedDateParts } from '../src/utils/countdown';
import { sanitizeHtml, validateWish } from '../src/utils/security';

test('isLeapYear checks leap years correctly', () => {
  assert.equal(isLeapYear(2024), true);
  assert.equal(isLeapYear(2028), true);
  assert.equal(isLeapYear(2026), false);
  assert.equal(isLeapYear(2100), false);
  assert.equal(isLeapYear(2000), true);
});

test('calculateBirthdayCountdown calculates future target accurately before birthday', () => {
  // 25 October 2026 in Asia/Kolkata
  const testDate = new Date('2026-10-25T12:00:00+05:30');
  const result = calculateBirthdayCountdown(23, 11, 'Asia/Kolkata', testDate);

  assert.equal(result.isBirthday, false);
  assert.equal(result.targetYear, 2026);
  assert.equal(result.days >= 28 && result.days <= 30, true);
});

test('calculateBirthdayCountdown detects birthday day correctly', () => {
  // 23 November 2026 14:30:00 in Asia/Kolkata
  const birthdayDate = new Date('2026-11-23T14:30:00+05:30');
  const result = calculateBirthdayCountdown(23, 11, 'Asia/Kolkata', birthdayDate);

  assert.equal(result.isBirthday, true);
  assert.equal(result.days, 0);
  assert.equal(result.hours, 0);
  assert.equal(result.minutes, 0);
  assert.equal(result.seconds, 0);
  assert.equal(result.targetYear, 2026);
});

test('calculateBirthdayCountdown rolls over to next year after birthday passes', () => {
  // 24 November 2026 in Asia/Kolkata
  const pastDate = new Date('2026-11-24T10:00:00+05:30');
  const result = calculateBirthdayCountdown(23, 11, 'Asia/Kolkata', pastDate);

  assert.equal(result.isBirthday, false);
  assert.equal(result.targetYear, 2027);
  assert.equal(result.days > 360, true);
});

test('sanitizeHtml escapes dangerous scripts and tags', () => {
  const dangerous = '<script>alert("hacked")</script><img src=x onerror=alert(1)> & "quotes"';
  const clean = sanitizeHtml(dangerous);

  assert.equal(clean.includes('<script>'), false);
  assert.equal(clean.includes('&lt;script&gt;'), true);
  assert.equal(clean.includes('&quot;quotes&quot;'), true);
});

test('validateWish rejects empty, too short, or too long inputs', () => {
  assert.equal(validateWish('', 'Happy Birthday!').valid, false);
  assert.equal(validateWish('A', 'Happy Birthday!').valid, false);
  assert.equal(validateWish('Sneha', '').valid, false);
  assert.equal(validateWish('Sneha', 'Hi').valid, false); // < 5 chars

  const good = validateWish('Sneha Verma', 'Wishing you the happiest birthday Lalee!');
  assert.equal(good.valid, true);
  assert.equal(good.sanitizedName, 'Sneha Verma');
});
