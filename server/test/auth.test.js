const test = require('node:test');
const assert = require('node:assert');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

test('SkillSwap Auth Security: Bcrypt & JWT verification', async (t) => {
  const plainPassword = 'password123';
  const secret = 'test_secret_key_skillswap';

  await t.test('Bcrypt hashes and verifies password correctly', async () => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);

    assert.notStrictEqual(plainPassword, hash);
    const isValid = await bcrypt.compare(plainPassword, hash);
    assert.strictEqual(isValid, true);

    const isWrong = await bcrypt.compare('wrongpassword', hash);
    assert.strictEqual(isWrong, false);
  });

  await t.test('JWT generates and verifies correctly with payload', () => {
    const userId = 'user_alex_123';
    const token = jwt.sign({ id: userId }, secret, { expiresIn: '1h' });

    const decoded = jwt.verify(token, secret);
    assert.strictEqual(decoded.id, userId);
  });

  await t.test('JWT fails with invalid secret or malformed token', () => {
    const token = jwt.sign({ id: 'user_123' }, secret);
    assert.throws(() => {
      jwt.verify(token, 'different_secret');
    });
  });
});

