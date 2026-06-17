const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testar() {
  const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
    email: 'italo@intsaude.com',
    senha: '123456',
  });

  const token = loginRes.data.token;
  console.log('✅ Login OK — Token:', token);

  const unidadesRes = await axios.get(`${BASE_URL}/unidades`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('🏥 Unidades:', unidadesRes.data);

  const buscarRes = await axios.get(`${BASE_URL}/unidades/buscar?tipo=UPA`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('🔍 UPAs:', buscarRes.data);
}

testar().catch(console.error);