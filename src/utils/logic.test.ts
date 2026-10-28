import test from 'node:test';
import assert from 'node:assert/strict';
import { extractHashtags, getHashtagSuggestions, isValidHashtag } from './hashtagParser';
import { encryptE2EEMessage, decryptE2EEMessage, generateSafetyFingerprint, formatVanishingTimer } from './security';

test('extractHashtags correctly extracts unique hashtags from post captions', () => {
  const caption = 'Excited to launch #MediaSourceHub from #Bihar with #RanjeetKumar! Duplicate #Bihar check.';
  const tags = extractHashtags(caption);
  
  assert.equal(tags.length, 3);
  assert.ok(tags.includes('#MediaSourceHub'));
  assert.ok(tags.includes('#Bihar'));
  assert.ok(tags.includes('#RanjeetKumar'));
});

test('extractHashtags returns empty array for captions with no tags', () => {
  assert.deepEqual(extractHashtags('Just a regular caption without tags'), []);
  assert.deepEqual(extractHashtags(''), []);
});

test('getHashtagSuggestions returns relevant matches for query', () => {
  const suggestions = getHashtagSuggestions('bihar', 4);
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.some(t => t.toLowerCase().includes('bihar')));

  const customSuggestions = getHashtagSuggestions('NewCustomTrend', 4);
  assert.equal(customSuggestions[0], '#newcustomtrend');
});

test('isValidHashtag validates correct hashtag formatting', () => {
  assert.equal(isValidHashtag('#MediaSourceHub'), true);
  assert.equal(isValidHashtag('Bihar2026'), true);
  assert.equal(isValidHashtag('#'), false);
  assert.equal(isValidHashtag(''), false);
});

test('E2EE encryption and decryption successfully restores original plaintext', () => {
  const secretText = 'Confidential Media Source Hub message with owner Ranjeet Kumar';
  const customKey = 'e2ee-secret-aes-key-2026';

  const encrypted = encryptE2EEMessage(secretText, customKey);
  assert.ok(encrypted.ciphertext.length > 0);
  assert.notEqual(encrypted.ciphertext, secretText);
  assert.ok(encrypted.iv.length > 0);
  assert.ok(encrypted.hash.length > 0);

  const decrypted = decryptE2EEMessage(encrypted.ciphertext, encrypted.iv, customKey);
  assert.equal(decrypted, secretText);
});

test('generateSafetyFingerprint returns consistent 12-digit grouped format', () => {
  const fp1 = generateSafetyFingerprint('user-1', 'user-2');
  const fp2 = generateSafetyFingerprint('user-2', 'user-1'); // symmetric order
  
  assert.equal(fp1, fp2);
  assert.match(fp1, /^\d{4} \d{4} \d{4}$/);
});

test('formatVanishingTimer formats seconds into clean display labels', () => {
  assert.equal(formatVanishingTimer(0), 'Off');
  assert.equal(formatVanishingTimer(5), '5s');
  assert.equal(formatVanishingTimer(30), '30s');
  assert.equal(formatVanishingTimer(60), '1m');
  assert.equal(formatVanishingTimer(300), '5m');
});
