import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>2048</Text>
          <Text style={styles.subtitle}>Join the tiles, get to 2048!</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => router.push('/(game)/play')}
          >
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>

          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              Swipe to move tiles. When two tiles with the same number touch, they merge into one!
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Classic Puzzle Game • v1.0.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8ef',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#776e65',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#776e65',
    opacity: 0.7,
  },
  menuContainer: {
    gap: 24,
  },
  playButton: {
    backgroundColor: '#8f7a66',
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f9f6f2',
  },
  instructions: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  instructionText: {
    fontSize: 16,
    color: '#776e65',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#776e65',
    opacity: 0.5,
  },
});