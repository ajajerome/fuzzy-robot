import { SafeAreaView, Text, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ff00ff' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <Text style={{ color: '#000000', fontSize: 24, fontWeight: '800' }}>UI TEST DEV</Text>
        <Text style={{ color: '#000000', marginTop: 8, textAlign: 'center' }}>Ska visas i magenta bakgrund</Text>
      </View>
    </SafeAreaView>
  );
}

