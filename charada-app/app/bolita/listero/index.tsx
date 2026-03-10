import { useAuthMe } from "@/api/use-auth";
import { useListByBossId } from "@/api/use-lists";
import { AppButton } from "@/components/app/app-button";
import { PlayCard } from "@/components/app/play-card";
import { RoleScreenHeader } from "@/components/app/role-screen-header";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import type { Play } from "@/services/plays.service";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListeroScreen() {
  const router = useRouter();
  const { data: user } = useAuthMe();
  const bossId = user?.bossId;
  const {
    data: list,
    isLoading,
    isError,
    refetch,
  } = useListByBossId(bossId, {
    enabled: typeof bossId === "number",
  });

  const plays = (list?.plays ?? []) as Play[];
  const hasList = list != null;
  const noBoss = user && (user.bossId == null || user.bossId === undefined);

  // Al volver de registrar jugada, forzamos refetch para que se vea la nueva.
  useFocusEffect(
    useCallback(() => {
      if (typeof bossId === "number") {
        refetch();
      }
    }, [bossId, refetch]),
  );

  if (isLoading || !user) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#faf8ef" }}
        edges={["top"]}
      >
        <Box className="flex-1 justify-center items-center p-6">
          <Text className="text-[#776e65]">Cargando…</Text>
        </Box>
      </SafeAreaView>
    );
  }

  if (noBoss) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#faf8ef" }}
        edges={["top"]}
      >
        <Box className="flex-1 justify-center items-center p-6">
          <Text className="text-center text-[#776e65]">
            No estás asignado a ningún boss. Contacta a tu boss o al
            administrador.
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#faf8ef" }}
        edges={["top"]}
      >
        <Box className="flex-1 justify-center items-center p-6">
          <Text className="text-center text-[#776e65] mb-4">
            No se pudo cargar la lista del jefe.
          </Text>
          <AppButton label="Reintentar" onPress={() => refetch()} />
        </Box>
      </SafeAreaView>
    );
  }

  if (!hasList) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#faf8ef" }}
        edges={["top"]}
      >
        <Box className="flex-1 justify-center items-center p-6">
          <Text className="text-center text-[#776e65]">
            Tu boss aún no tiene lista creada. Cuando la tenga, aquí verás las
            jugadas que vayas recogiendo para él.
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#faf8ef" }}
      edges={["top"]}
    >
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <VStack className="gap-4">
          <RoleScreenHeader title="Jugadas que entregas a tu boss" />

          <HStack className="justify-between">
            <AppButton
              label="Ver resumen por fecha"
              onPress={() => router.push("/bolita/listero/history")}
            />
            <AppButton
              label="Registrar nueva jugada"
              onPress={() =>
                router.push({
                  pathname: "/bolita/listero/add-play",
                  params: { listId: String(list.id) },
                })
              }
            />
          </HStack>

          {plays.length === 0 ? (
            <Text className="text-center text-[#999] py-6">
              Aún no has registrado jugadas para tu boss en esta lista.
            </Text>
          ) : (
            <VStack className="gap-0">
              {plays.map((play) => (
                <PlayCard key={play.id} play={play} />
              ))}
            </VStack>
          )}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
