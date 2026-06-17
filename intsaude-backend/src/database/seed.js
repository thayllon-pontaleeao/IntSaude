const db = require('./db');
const unidades = require('../data/unidades');

db.serialize(() => {
  db.get('SELECT COUNT(*) as total FROM unidades', (err, row) => {
    if (err || row.total > 0) return;

    const stmt = db.prepare(`
      INSERT INTO unidades (nome, tipo, endereco, telefone, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    unidades.forEach(u => {
      stmt.run(u.nome, u.tipo, u.endereco, u.telefone, u.latitude, u.longitude);
    });

    stmt.finalize();
    console.log('✅ Unidades inseridas no banco');
  });
});