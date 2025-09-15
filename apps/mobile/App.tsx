import { SafeAreaView, Text, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { fetchScenario, scoreAnswer } from './src/lib/api';
import { MatchScenario, ScenarioAnswer } from './src/types/scenario';
import { PitchLite, PlayerToken } from './src/components/PitchLite';
import { scenarioPlayersToTokens } from './src/utils/players';

export default function App() {
  const [loading, setLoading] = React.useState(false);
  const [scenario, setScenario] = React.useState<MatchScenario | null>(null);
  const [tokens, setTokens] = React.useState<PlayerToken[]>([]);
  const [error, setError] = React.useState<string>('');
  const [scoreText, setScoreText] = React.useState<string>('');

  const load = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const s = await fetchScenario();
      setScenario(s);
      setTokens(scenarioPlayersToTokens(s));
    } catch (e: any) {
      setError(e?.message ?? 'Fel');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0b1a30' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 24 }}>
        <Text style={{ color: '#eaf1ff', fontSize: 22, fontWeight: '800' }}>Spelförståelse FC – Build trigger v3</Text>
        <TouchableOpacity onPress={load} style={{ marginTop: 16, backgroundColor: '#1e3a8a', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 }}>
          <Text style={{ color: '#eaf1ff', fontSize: 16, fontWeight: '700' }}>Hämta scenario</Text>
        </TouchableOpacity>
        {loading ? <ActivityIndicator color="#eaf1ff" style={{ marginTop: 16 }} /> : null}
        {error ? <Text style={{ color: '#fca5a5', marginTop: 12 }}>{error}</Text> : null}
        {scenario ? (
          <View style={{ marginTop: 16, alignItems: 'center', width: '100%' }}>
            <Text style={{ color: '#eaf1ff', fontSize: 16, fontWeight: '700', textAlign: 'center' }}>{scenario.title}</Text>
            <Text style={{ color: '#8aa4d6', marginTop: 6 }}>Format: {scenario.format} – Ålder: {scenario.ageGroup}</Text>
            <Text style={{ color: '#8aa4d6', marginTop: 6, textAlign: 'center' }}>{scenario.prompt}</Text>

            <View style={{ width: '100%', alignItems: 'center', marginTop: 12 }}>
              <PitchLite
                width={Math.min(360, Math.round(0.92 * 360))}
                height={220}
                players={tokens}
                onMove={(id, x, y) => setTokens(prev => prev.map(p => p.id === id ? { ...p, x, y } : p))}
              />
              <TouchableOpacity onPress={() => setTokens(scenarioPlayersToTokens(scenario))} style={{ marginTop: 8 }}>
                <Text style={{ color: '#93c5fd' }}>Återställ spelare</Text>
              </TouchableOpacity>
            </View>

            {/* Minimal interaktion: simulera ett pass + en löpning och bedöm */}
            <TouchableOpacity
              onPress={async () => {
                try {
                  setError('');
                  setScoreText('');
                  const answer: ScenarioAnswer = {
                    scenarioId: scenario.id,
                    passes: [ { path: [ { x: 100, y: 300 }, { x: 300, y: 300 } ] } ],
                    runs: [ { playerId: 'home-mf1', path: [ { x: 120, y: 320 }, { x: 280, y: 360 } ] } ],
                  };
                  const res = await scoreAnswer({ scenario, answer });
                  setScoreText(`Poäng: ${res.score} – progression ${Math.round(res.breakdown.progression*100)}%`);
                } catch (e: any) {
                  setError(e?.message ?? 'Fel vid bedömning');
                }
              }}
              style={{ marginTop: 16, backgroundColor: '#00bcd4', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 }}
            >
              <Text style={{ color: '#0b1a30', fontSize: 16, fontWeight: '700' }}>Bedöm mitt svar</Text>
            </TouchableOpacity>

            {scoreText ? <Text style={{ color: '#eaf1ff', marginTop: 10 }}>{scoreText}</Text> : null}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

