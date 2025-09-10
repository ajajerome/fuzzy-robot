import React, { useCallback, useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { colors } from './src/theme';
import { PitchLite, PlayerToken } from './src/components/PitchLite';

export default function App() {
  // Simple error boundary-ish state
  try {
  const [status, setStatus] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [players, setPlayers] = useState<PlayerToken[]>([
    { id: 'home-gk', team: 'home', x: 0.08, y: 0.5 },
    { id: 'home-df1', team: 'home', x: 0.2, y: 0.3 },
    { id: 'home-df2', team: 'home', x: 0.2, y: 0.7 },
    { id: 'away-st', team: 'away', x: 0.8, y: 0.5 },
  ]);

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  const testScenario = useCallback(async () => {
    if (!supabaseUrl || !supabaseAnon) {
      setStatus('Saknar EXPO_PUBLIC_SUPABASE_URL eller EXPO_PUBLIC_SUPABASE_ANON_KEY');
      return;
    }
    try {
      setStatus('Hämtar scenario...');
      const res = await fetch(`${supabaseUrl}/generate_scenario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnon}`,
        },
        body: JSON.stringify({ ageGroup: 'U11-12', level: 'basic', format: '7v7' }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      const json = await res.json();
      setTitle(json?.scenario?.title ?? '');
      setStatus('Klar');
    } catch (err: any) {
      setStatus(err?.message ?? 'Fel vid anrop');
    }
  }, [supabaseUrl, supabaseAnon]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <Text style={{ color: colors.textPrimary, fontSize: 22, fontWeight: '700' }}>Spelförståelse FC</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 8, textAlign: 'center' }}>
          Expo staging – tryck för att testa scenario-API
        </Text>

        <TouchableOpacity
          onPress={testScenario}
          activeOpacity={0.85}
          style={{ marginTop: 24, backgroundColor: '#1e3a8a', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 }}
        >
          <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '700' }}>Testa generate_scenario</Text>
        </TouchableOpacity>

        {status ? (
          <Text style={{ color: colors.textSecondary, marginTop: 16, textAlign: 'center' }}>{status}</Text>
        ) : null}
        {title ? (
          <Text style={{ color: colors.textPrimary, marginTop: 8, textAlign: 'center' }}>{title}</Text>
        ) : null}

        <View style={{ width: '90%', height: 260, marginTop: 20 }}>
          <PitchLite
            width={Math.min(360, Math.round(0.9 * 360))}
            height={220}
            players={players}
            onMove={(id, x, y) => setPlayers(prev => prev.map(p => p.id === id ? { ...p, x, y } : p))}
          />
        </View>
      </View>
    </SafeAreaView>
  );
  } catch (e: any) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0b1a30' }}>
        <StatusBar style="light" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <Text style={{ color: '#eaf1ff', fontSize: 18, fontWeight: '700' }}>Ett fel inträffade</Text>
          <Text style={{ color: '#8aa4d6', marginTop: 8, textAlign: 'center' }}>{String(e?.message ?? e)}</Text>
        </View>
      </SafeAreaView>
    );
  }
}

