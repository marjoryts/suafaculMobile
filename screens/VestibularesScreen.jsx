import { View, Text, StyleSheet } from 'react-native';

export default function VestibularesScreen() {
  return (
    <View style={styles.container}>
      <Text>Vestibulares</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});