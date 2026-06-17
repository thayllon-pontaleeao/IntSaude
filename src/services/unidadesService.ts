import api from './api';

export async function getUnidades() {
  const response = await api.get('/unidades');
  return response.data;
}

export async function getUnidadesPorTipo(tipo: string) {
  const response = await api.get(`/unidades/buscar?tipo=${tipo}`);
  return response.data;
}

export async function getUnidadeById(id: number) {
  const response = await api.get(`/unidades/${id}`);
  return response.data;
}