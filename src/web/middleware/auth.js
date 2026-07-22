const jwt = require('jsonwebtoken');
const { env } = require('../../config/env');

function issueToken(username) {
  return jwt.sign({ sub: username, role: 'admin' }, env.jwtSecret, { expiresIn: '12h' });
}

function readToken(req) {
  const token = req.cookies?.bunthy_admin;
  if (!token) return null;
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch {
    return null;
  }
}

function requireAuth(req, res, next) {
  const user = readToken(req);
  if (!user) return res.redirect('/login');
  req.admin = user;
  next();
}

module.exports = { issueToken, readToken, requireAuth };
