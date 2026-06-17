const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../database/db');

const DEMO_USERS = {
  'admin@sus.gov.br':      { nome: 'Administrador',     senha: '1234', role: 'admin' },
  'gestor@sus.gov.br':     { nome: 'Gestor Hospitalar', senha: '1234', role: 'gestor' },
  'supervisor@sus.gov.br': { nome: 'Supervisor',        senha: '1234', role: 'supervisor' },
};

router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const demo = DEMO_USERS[email];
  if (demo) {
    if (demo.senha !== senha) return res.status(401).json({ error: 'Senha incorreta.' });
    const token = jwt.sign({ nome: demo.nome, email, role: demo.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, usuario: { nome: demo.nome, email, role: demo.role } });
  }

  db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Erro interno.' });
    if (!user) return res.status(401).json({ error: 'E-mail não encontrado.' });
    if (user.senha !== senha) return res.status(401).json({ error: 'Senha incorreta.' });

    const token = jwt.sign({ id: user.id, nome: user.nome, email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, usuario: { id: user.id, nome: user.nome, email, role: user.role } });
  });
});

router.post('/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ error: 'Preencha todos os campos.' });

  db.run('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'E-mail já cadastrado.' });
      return res.status(500).json({ error: 'Erro ao cadastrar.' });
    }
    const token = jwt.sign({ id: this.lastID, nome, email, role: 'paciente' }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, usuario: { id: this.lastID, nome, email, role: 'paciente' } });
  });
});

module.exports = router;