import { MatchScenario } from '../types/scenario';

const baseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export async function fetchScenario(): Promise<MatchScenario> {
  if (!baseUrl || !anon) throw new Error('Saknar SUPABASE env');
  const res = await fetch(`${baseUrl}/generate_scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${anon}` },
    body: JSON.stringify({ ageGroup: 'U11-12', level: 'basic', format: '7v7' }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.scenario as MatchScenario;
}

