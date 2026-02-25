import React, { useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Keyboard,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { Tile2048 } from './Tile2048';
import { getTileColor, getTextColor, Direction, Tile } from '../../hooks/use2048';

const GRID_SIZE = 4;
const GAP = 8;

interface Board2048Props {
  tiles: Tile[];
  move: (direction: Direction) => boolean;
}

export const Board2048: React.FC<Board2048Props> = ({ tiles, move }) => {
  const { width } = useWindowDimensions();
  const boardSize = Math.min(width - 48, 380);
  const cellSize = (boardSize - GAP * (GRID_SIZE + 1)) / GRID_SIZE;
  const tileSize = cellSize - GAP;

  const startX = useRef(0);
  const startY = useRef(0);

  const handleMove = useCallback((direction: Direction) => {
    Keyboard.dismiss();
    move(direction);
  }, [move]);

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      startX.current = e.x;
      startY.current = e.y;
    })
    .onEnd((e) => {
      const deltaX = e.x - startX.current;
      const deltaY = e.y - startY.current;
      const minSwipe = 30;

      if (Math.abs(deltaX) < minSwipe && Math.abs(deltaY) < minSwipe) {
        return;
      }

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          runOnJS(handleMove)('right');
        } else {
          runOnJS(handleMove)('left');
        }
      } else {
        if (deltaY > 0) {
          runOnJS(handleMove)('down');
        } else {
          runOnJS(handleMove)('up');
        }
      }
    });

  const renderEmptyCells = () => {
    const cells = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const position = {
          left: GAP + col * (cellSize + GAP),
          top: GAP + row * (cellSize + GAP),
          width: tileSize,
          height: tileSize,
        };
        cells.push(
          <View
            key={`cell-${row}-${col}`}
            style={[styles.cell, position]}
          />
        );
      }
    }
    return cells;
  };

  const renderTiles = () => {
    return tiles.map((tile) => (
      <Tile2048
        key={tile.id}
        tile={tile}
        getTileColor={getTileColor as (value: number) => string}
        getTextColor={getTextColor as (value: number) => string}
        cellSize={cellSize}
        tileSize={tileSize}
        gap={GAP}
      />
    ));
  };

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.boardWrapper, { width: boardSize, height: boardSize }]}>
        <View style={[styles.board, { width: boardSize, height: boardSize }]}>
          {renderEmptyCells()}
          {renderTiles()}
        </View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  boardWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  board: {
    backgroundColor: '#bbada0',
    borderRadius: 8,
    position: 'relative',
  },
  cell: {
    position: 'absolute',
    backgroundColor: 'rgba(238, 228, 218, 0.35)',
    borderRadius: 6,
  },
});
