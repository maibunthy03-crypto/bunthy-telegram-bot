const express = require('express');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { env } = require('../../config/env');
const { issueToken } = require('../middleware/auth');
const { layout, escapeHtml } = require('../views/layout');

const router = express.Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true });

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

router.get('/login', (req, res) => {
  res.send(layout({
    title: 'Admin login',
    body: `<section class="login-card">
      <div class="login-logo">👑</div>
      <h1>Bunthy Admin</h1>
      <p>Secure dashboard access</p>
      <form method="post" action="/login">
        <label>Username<input name="username" autocomplete="username" required></label>
        <label>Password<input type="password" name="password" autocomplete="current-password" required></label>
        <button class="primary">Sign in</button>
      </form>
    </section>`
  }));
});

router.post('/login', limiter, express.urlencoded({ extended: false }), (req, res) => {
  const valid = safeEqual(req.body.username, env.adminUsername) &&
    safeEqual(req.body.password, env.adminPassword);

  if (!valid) {
    return res.status(401).send(layout({
      title: 'Login failed',
      body: `<section class="login-card"><h1>Login failed</h1><p>Incorrect username or password.</p><a class="button" href="/login">Try again</a></section>`
    }));
  }

  res.cookie('bunthy_admin', issueToken(env.adminUsername), {
    httpOnly: true, secure: env.nodeEnv === 'production',
    sameSite: 'lax', maxAge: 12 * 60 * 60 * 1000
  });
  return res.redirect('/');
});

router.post('/logout', (req, res) => {
  res.clearCookie('bunthy_admin');
  res.redirect('/login');
});

module.exports = router;
