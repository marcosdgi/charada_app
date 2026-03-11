import { useState } from "react";
import { usePlaysByDate } from "@/api/use-plays";
import { PlayCard } from "@/components/app/play-card";
import { RoleScreenHeader } from "@/components/app/role-screen-header";
import { AppButton } from "@/components/app/app-button";
import { AppInput } from "@/components/app/app-input";
import { Box } from "@/components/ui/box";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { getTodayUTC } from "@/lib/date-utc";
import type { Play } from "@/services/plays.service";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BossHistoryScreen() {
  const [date, setDate] = useState(getTodayUTC());

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = usePlaysByDate(date, 1, {
    enabled: !!date,
  });

  const plays = ((data?.data as Play[]) ?? []) as Play[];

  const totalAmount = plays.reduce(
    (sum, play) => sum + Number(play.amount ?? 0),
    0,
  );

  const hasDate = !!date;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#faf8ef" }}
      edges={["top"]}
    >
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <VStack className="gap-4">
          <RoleScreenHeader title="Resumen diario de tus listeros" />

          <VStack className="gap-2">
            <Text className="text-base font-semibold text-[#776e65]">
              Fecha
            </Text>
            <AppInput
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
            />
            <HStack className="justify-end">
              <AppButton
                label="Actualizar"
                onPress={() => {
                  if (hasDate) refetch();
                }}
                isLoading={isLoading}
              />
            </HStack>
          </VStack>

          {isError && (
            <Box className="py-4">
              <Text className="text-center text-[#776e65]">
                No se pudieron cargar las jugadas de ese día.
              </Text>
            </Box>
          )}

          {!isError && hasDate && (
            <>
              <Box className="py-2">
                <Text className="text-sm text-[#776e65]">
                  Jugadas del día: {plays.length}
                </Text>
                <Text className="text-sm font-semibold text-[#776e65]">
                  Total recogido: $
                  {totalAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </Box>

              {isLoading ? (
                <Box className="py-6">
                  <Text className="text-center text-[#776e65]">
                    Cargando jugadas…
                  </Text>
                </Box>
              ) : plays.length === 0 ? (
                <Box className="py-6">
                  <Text className="text-center text-[#999]">
                    No hay jugadas registradas para esta fecha.
                  </Text>
                </Box>
              ) : (
                <VStack className="gap-0">
                  {plays.map((play) => (
                    <PlayCard key={play.id} play={play} />
                  ))}
                </VStack>
              )}
            </>
          )}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}

