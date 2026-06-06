import { supabase } from '../lib/supabase';

export type HealthUnit = {
  id: string;
  name: string;
  type: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  hours: string | null;
};

export async function getAllUnits(): Promise<HealthUnit[]> {
  const { data, error } = await supabase
    .from('health_units')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
}

export async function searchUnits(query: string): Promise<HealthUnit[]> {
  const { data, error } = await supabase
    .from('health_units')
    .select('*')
    .ilike('name', `%${query}%`);
  if (error) throw error;
  return data;
}

export async function getUnitsByType(type: string): Promise<HealthUnit[]> {
  const { data, error } = await supabase
    .from('health_units')
    .select('*')
    .eq('type', type);
  if (error) throw error;
  return data;
}