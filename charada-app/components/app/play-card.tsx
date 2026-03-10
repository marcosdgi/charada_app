import React from 'react';
import { Card } from '@/components/ui/card';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { TYPE_PLAY_LABELS } from '@/lib/plays';
import type { Play } from '@/services/plays.service';

type PlayCardProps = {
  play: Play;
};

export function PlayCard({ play }: PlayCardProps) {
  const typeLabel = TYPE_PLAY_LABELS[play.typePlayId] ?? `Tipo ${play.typePlayId}`;
  const numbers: string[] = [`Fijo: ${play.fijo}`];
  if (play.corrido != null) numbers.push(`Corrido: ${play.corrido}`);
  if (play.parle != null) numbers.push(`Parle: ${play.parle}`);

  return (
    <Card className="p-4 mb-2 bg-white border border-[#ddd] rounded-lg">
      <HStack className="justify-between items-start flex-wrap gap-2">
        <VStack className="gap-1 flex-1">
          <Text className="text-sm font-semibold text-[#8f7a66]">{typeLabel}</Text>
          {play.name ? (
            <Text className="text-sm text-[#776e65]">
              Cliente: {play.name}
            </Text>
          ) : null}
          <Text className="text-base text-[#776e65]">{numbers.join(' · ')}</Text>
          <Text className="text-xs text-[#999]">{play.date}</Text>
        </VStack>
        <Text className="text-base font-semibold text-[#776e65]">
          ${Number(play.amount).toLocaleString()}
        </Text>
      </HStack>
    </Card>
  );
}
