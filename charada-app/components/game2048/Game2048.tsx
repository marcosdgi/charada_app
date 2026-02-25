import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Board2048 } from './Board2048';
import { use2048 } from '../../hooks/use2048';

export const Game2048: React.FC = () => {
  const { width } = useWindowDimensions();
  const {
    tiles,
    score,
    bestScore,
    gameOver,
    won,
    resetGame,
    move,
  } = use2048();

  const boardSize = Math.min(width - 48, 380);

  const handleKeyPress = (key: string) => {
    switch (key) {
      case 'ArrowUp':
        move('up');
        break;
      case 'ArrowDown':
        move('down');
        break;
      case 'ArrowLeft':
        move('left');
        break;
      case 'ArrowRight':
        move('right');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>2048</Text>
          <Text style={styles.subtitle}>¡Une los números y llega a 2048!</Text>
        </View>

        <View style={styles.scoreContainer}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>PUNTAJE</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>MEJOR</Text>
            <Text style={styles.scoreValue}>{bestScore}</Text>
          </View>
        </View>
      </View>

      <View style={styles.gameContainer}>
        <Board2048 tiles={tiles} move={move} />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.newGameButton} onPress={resetGame}>
          <Text style={styles.newGameButtonText}>Nuevo Juego</Text>
        </TouchableOpacity>
      </View>

      {/* Game Over Modal */}
      <Modal
        visible={gameOver}
        transparent
        animationType="fade"
      >
        <Pressable style={styles.modalOverlay} onPress={resetGame}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¡Game Over!</Text>
            <Text style={styles.modalScore}>Puntaje: {score}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={resetGame}>
              <Text style={styles.modalButtonText}>Jugar de nuevo</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Won Modal */}
      <Modal
        visible={won && !gameOver}
        transparent
        animationType="fade"
      >
        <Pressable style={styles.modalOverlay} onPress={() => {}}>
          <View style={[styles.modalContent, styles.wonModal]}>
            <Text style={styles.modalTitle}>¡Ganaste! 🎉</Text>
            <Text style={styles.modalScore}>¡Alcanzaste el 2048!</Text>
            <View style={styles.wonButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.wonButton]} 
                onPress={resetGame}
              >
                <Text style={styles.modalButtonText}>Nuevo Juego</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.continueButton]} 
                onPress={() => {}}
              >
                <Text style={styles.modalButtonText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8ef',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#776e65',
  },
  subtitle: {
    fontSize: 14,
    color: '#776e65',
    marginTop: -4,
  },
  scoreContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  scoreBox: {
    backgroundColor: '#bbada0',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 60,
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#eee4da',
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    padding: 20,
    alignItems: 'center',
  },
  newGameButton: {
    backgroundColor: '#8f7a66',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 6,
  },
  newGameButtonText: {
    color: '#f9f6f2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#faf8ef',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    margin: 20,
  },
  wonModal: {
    borderWidth: 4,
    borderColor: '#edc22e',
  },
  modalTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#776e65',
    marginBottom: 8,
  },
  modalScore: {
    fontSize: 20,
    color: '#776e65',
    marginBottom: 24,
  },
  wonButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    backgroundColor: '#8f7a66',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  wonButton: {
    backgroundColor: '#f65e3b',
  },
  continueButton: {
    backgroundColor: '#edc22e',
  },
  modalButtonText: {
    color: '#f9f6f2',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
