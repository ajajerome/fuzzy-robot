import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, message: String(error?.message ?? error) };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <StatusBar style="light" />
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: '700' }}>Ett fel inträffade</Text>
            <Text style={{ color: colors.textSecondary, marginTop: 8, textAlign: 'center' }}>{this.state.message}</Text>
          </View>
        </SafeAreaView>
      );
    }
    return this.props.children as any;
  }
}

