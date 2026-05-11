import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Image 
        source={require('./assets/logo-purple.png')} 
        style={{ width: 200, height: 100 }} 
        resizeMode="contain" 
      />
      <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#999" />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry placeholderTextColor="#999" />
      <TouchableOpacity style={styles.button}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>ENTRAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  input: { width: '100%', height: 50, borderBottomWidth: 1, borderBottomColor: '#6200EE', marginBottom: 20, paddingHorizontal: 10 },
  button: { width: '100%', height: 50, backgroundColor: '#6200EE', justifyContent: 'center', alignItems: 'center', borderRadius: 8 }
});