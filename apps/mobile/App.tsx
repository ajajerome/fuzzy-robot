import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0b1a30' }}>
      <StatusBar style="light" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#eaf1ff', fontSize: 22, fontWeight: '700' }}>Spelförståelse FC</Text>
        <Text style={{ color: '#8aa4d6', marginTop: 8 }}>Expo baseline – redo för EAS-build</Text>
      </View>
    </SafeAreaView>
  );
}

