import React from 'react';
import { ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';

/**
 * About Screen - Game Information
 */
export default function ExploreScreen() {
  return (
    <ScrollView className="flex-1 bg-background-0">
      <VStack className="p-4 gap-4">
        <Heading size="2xl" className="text-typography-900 mb-2">
          About 2048
        </Heading>

        <Card className="p-4">
          <Heading size="md" className="mb-2">
            How to Play
          </Heading>
          <Text className="text-typography-700">
            Swipe to move all tiles. When two tiles with the same number touch,
            they merge into one! Your goal is to create a tile with the number 2048.
          </Text>
        </Card>

        <Card className="p-4">
          <Heading size="md" className="mb-2">
            Rules
          </Heading>
          <VStack className="gap-2">
            <Text className="text-typography-700">
              • Swipe up, down, left, or right to move tiles
            </Text>
            <Text className="text-typography-700">
              • Tiles with the same number merge when they touch
            </Text>
            <Text className="text-typography-700">
              • After each move, a new tile appears
            </Text>
            <Text className="text-typography-700">
              • Win by reaching 2048, but don't stop there!
            </Text>
            <Text className="text-typography-700">
              • Game over when no moves are possible
            </Text>
          </VStack>
        </Card>

        <Card className="p-4">
          <Heading size="md" className="mb-2">
            Tips
          </Heading>
          <VStack className="gap-2">
            <Text className="text-typography-700">
              • Keep your highest tile in a corner
            </Text>
            <Text className="text-typography-700">
              • Build tiles in descending order near your highest tile
            </Text>
            <Text className="text-typography-700">
              • Try to move in only two or three directions
            </Text>
            <Text className="text-typography-700">
              • Don't focus on the score, focus on combining tiles
            </Text>
          </VStack>
        </Card>
      </VStack>
    </ScrollView>
  );
}
