import { SafeAreaView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0b1a30' }}>
      <StatusBar style="light" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <Text style={{ color: '#eaf1ff', fontSize: 22, fontWeight: '700' }}>Hej från staging</Text>
        <Text style={{ color: '#8aa4d6', marginTop: 8, textAlign: 'center' }}>Minimal vy för felsökning</Text>
      </View>
    </SafeAreaView>
  );
}

