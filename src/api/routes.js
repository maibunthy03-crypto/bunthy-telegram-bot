const express = require('express');
const db = require('../database/db');
const router = express.Router();

router.get('/rooms', (req, res) => {
  const rows = db.prepare('SELECT * FROM rooms ORDER BY featured DESC, id DESC').all().map(room => ({
    ...room,
    available: Boolean(room.available), featured: Boolean(room.featured),
    photos: JSON.parse(room.photos_json || '[]'), facilities: JSON.parse(room.facilities_json || '[]'),
    servicesIncluded: JSON.parse(room.included_json || '[]'), servicesExcluded: JSON.parse(room.excluded_json || '[]')
  }));
  res.json(rows);
});
router.get('/rooms/:id', (req, res) => {
  const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json({ ...room, photos: JSON.parse(room.photos_json || '[]'), facilities: JSON.parse(room.facilities_json || '[]'), servicesIncluded: JSON.parse(room.included_json || '[]'), servicesExcluded: JSON.parse(room.excluded_json || '[]') });
});
router.get('/stats', (req, res) => res.json({
  rooms: db.prepare('SELECT COUNT(*) count FROM rooms').get().count,
  available: db.prepare('SELECT COUNT(*) count FROM rooms WHERE available=1').get().count,
  enquiries: db.prepare('SELECT COUNT(*) count FROM enquiries').get().count,
  translations: db.prepare('SELECT COUNT(*) count FROM translation_logs').get().count
}));
module.exports = router;
