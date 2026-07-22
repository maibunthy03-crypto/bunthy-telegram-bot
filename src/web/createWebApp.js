const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

function createWebApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  app.use(cookieParser());
  app.use(express.static(path.join(process.cwd(), 'public')));
  app.get('/health', (req, res) => res.status(200).json({ ok: true }));
  app.use(authRoutes);
  app.use(dashboardRoutes);
  app.use((req, res) => res.status(404).send('Not found'));
  return app;
}

module.exports = { createWebApp };
