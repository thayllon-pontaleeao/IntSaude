require('@dotenvx/dotenvx').config();
const express = require('express');
const cors = require('cors');

require('./database/db');
require('./database/seed');

const authRoutes = require('./routes/authRoutes');
const unidadesRoutes = require('./routes/unidadesRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/auth', authRoutes);
app.use('/unidades', unidadesRoutes);

app.get('/', (req, res) => res.json({ status: 'intSaúde API online 🏥' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));