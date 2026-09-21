// Estados padrão de tela: carregando e erro (com "Tentar novamente").
import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../context/ThemeContext';
import { errorMessage, isNetworkError } from '../src/api/client';

export function LoadingView({ message, style }) {
  const theme = useThemeContext();
  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }, style]}>
      <ActivityIndicator size="large" color="#FF9100" />
      {message ? <Text style={{ color: theme.textSecondary, marginTop: 12, fontSize: 14 }}>{message}</Text> : null}
    </View>
  );
}

export function ErrorView({ error, onRetry, style }) {
  const theme = useThemeContext();
  const semServidor = isNetworkError(error);
  return (
    <View style={[{ alignItems: 'center', paddingVertical: 40, paddingHorizontal: 30 }, style]}>
      <Ionicons name={semServidor ? 'cloud-offline-outline' : 'alert-circle-outline'} size={46} color="#FF9100" />
      <Text style={{ color: theme.textPrimary, fontSize: 17, fontWeight: '700', marginTop: 12, textAlign: 'center' }}>
        {semServidor ? 'Servidor indisponível' : 'Algo deu errado'}
      </Text>
      <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 8, textAlign: 'center', lineHeight: 20 }}>
        {errorMessage(error)}
      </Text>
      {onRetry ? (
        <TouchableOpacity
          onPress={onRetry}
          activeOpacity={0.85}
          style={{ marginTop: 18, backgroundColor: '#FF9100', borderRadius: 22, paddingVertical: 11, paddingHorizontal: 28 }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Tentar novamente</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
