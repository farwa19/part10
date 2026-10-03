import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [tapCount, setTapCount] = useState(0);
  console.log("hs");
  console.log("hi")

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.checkmark}>✓</Text>
        <Text style={styles.title}>Your app is working!</Text>
        <Text style={styles.message}>
          eslint connected
          check hi 
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setTapCount((count) => count + 1)}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Tap to test</Text>
        </Pressable>
        <Text style={styles.tapCount}>
          Button taps: {tapCount}
        </Text>
      </View>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    elevation: 3,
  },
  checkmark: {
    color: '#15803d',
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 12,
  },
  title: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    marginTop: 24,
    paddingHorizontal: 22,
    paddingVertical: 13,
  },
  buttonPressed: {
    backgroundColor: '#1d4ed8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tapCount: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 14,
  },
});
