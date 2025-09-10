import React, { useCallback, useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

export default function App() {
  // Simple error boundary-ish state
  try {
  const [status, setStatus] = useState<string>('');
  const [title, setTitle] = useState<string>('');

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0b1a30' }}>
      <StatusBar style="light" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <Text style={{ color: '#eaf1ff', fontSize: 22, fontWeight: '700' }}>Spelförståelse FC</Text>
        <Text style={{ color: '#8aa4d6', marginTop: 8, textAlign: 'center' }}>
          Expo staging – tryck för att testa scenario-API
        </Text>

        <TouchableOpacity
          onPress={testScenario}
          activeOpacity={0.85}
          style={{ marginTop: 24, backgroundColor: '#1e3a8a', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 }}
        >
          <Text style={{ color: '#eaf1ff', fontSize: 16, fontWeight: '700' }}>Testa generate_scenario</Text>
        </TouchableOpacity>

        {status ? (
          <Text style={{ color: '#8aa4d6', marginTop: 16, textAlign: 'center' }}>{status}</Text>
        ) : null}
        {title ? (
          <Text style={{ color: '#eaf1ff', marginTop: 8, textAlign: 'center' }}>{title}</Text>
        ) : null}
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

