import { SafeAreaView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { fetchScenario } from './src/lib/api';
import { MatchScenario } from './src/types/scenario';

export default function App() {
  const [loading, setLoading] = React.useState(false);
  const [scenario, setScenario] = React.useState<MatchScenario | null>(null);
  const [error, setError] = React.useState<string>('');

  const load = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const s = await fetchScenario();
      setScenario(s);
    } catch (e: any) {
      setError(e?.message ?? 'Fel');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0b1a30' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <Text style={{ color: '#eaf1ff', fontSize: 22, fontWeight: '800' }}>Spelförståelse FC</Text>
        <TouchableOpacity onPress={load} style={{ marginTop: 16, backgroundColor: '#1e3a8a', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 }}>
          <Text style={{ color: '#eaf1ff', fontSize: 16, fontWeight: '700' }}>Hämta scenario</Text>
        </TouchableOpacity>
        {loading ? <ActivityIndicator color="#eaf1ff" style={{ marginTop: 16 }} /> : null}
        {error ? <Text style={{ color: '#fca5a5', marginTop: 12 }}>{error}</Text> : null}
        {scenario ? (
          <View style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={{ color: '#eaf1ff', fontSize: 16, fontWeight: '700', textAlign: 'center' }}>{scenario.title}</Text>
            <Text style={{ color: '#8aa4d6', marginTop: 6 }}>Format: {scenario.format} – Ålder: {scenario.ageGroup}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

