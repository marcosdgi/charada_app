import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Tile } from '../../hooks/use2048';

interface TileProps {
  tile: Tile;
  getTileColor: (value: number) => string;
  getTextColor: (value: number) => string;
  cellSize: number;
  tileSize: number;
  gap: number;
}

export const Tile2048: React.FC<TileProps> = ({
  tile,
  getTileColor,
  getTextColor,
  cellSize,
  tileSize,
  gap,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const x = gap + tile.col * (cellSize + gap);
    const y = gap + tile.row * (cellSize + gap);

    return {
      transform: [
        { translateX: withSpring(x) },
        { translateY: withSpring(y) },
        { scale: withSpring(tile.isNew ? 1 : 1.05, {
          damping: 12,
          stiffness: 180,
        }) },
      ],
      opacity: tile.isNew ? withTiming(1, { duration: 200 }) : 1,
    };
  }, [tile.row, tile.col, tile.isNew, cellSize, gap]);

  const isLargeNumber = tile.value >= 1000;

  return (
    <Animated.View
      style={[
        styles.tile,
        animatedStyle,
        {
          width: tileSize,
          height: tileSize,
          backgroundColor: getTileColor(tile.value),
        },
      ]}
    >
      <Text
        style={[
          styles.tileText,
          {
            color: getTextColor(tile.value),
            fontSize: isLargeNumber ? tileSize * 0.28 : tileSize * 0.4,
          },
        ]}
      >
        {tile.value}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  tileText: {
    fontWeight: 'bold',
    fontFamily: 'System',
  },
});
