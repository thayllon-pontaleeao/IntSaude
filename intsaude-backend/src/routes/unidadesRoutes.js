const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const db = require('../database/db');

router.get('/', authMiddleware, (req, res) => {
  db.all('SELECT * FROM unidades', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar unidades.' });
    res.json(rows);
  });
});

router.get('/buscar', authMiddleware, (req, res) => {
  const { tipo } = req.query;
  if (!tipo) {
    return db.all('SELECT * FROM unidades', (err, rows) => {
      if (err) return res.status(500).json({ error: 'Erro ao buscar unidades.' });
      res.json(rows);
    });
  }
  db.all('SELECT * FROM unidades WHERE tipo = ?', [tipo], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar unidades.' });
    res.json(rows);
  });
});

router.get('/:id', authMiddleware, (req, res) => {
  db.get('SELECT * FROM unidades WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar unidade.' });
    if (!row) return res.status(404).json({ error: 'Unidade não encontrada.' });
    res.json(row);
  });
});

module.exports = router;