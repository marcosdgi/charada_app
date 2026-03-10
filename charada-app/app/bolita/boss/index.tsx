import { useState, useMemo, useCallback } from "react";
import { useAuthMe } from "@/api/use-auth";
import { useCreateList, useListByBossId, useListsFiltered } from "@/api/use-lists";
import { useEmployeesByBossId } from "@/api/use-employees";
import { AppButton } from "@/components/app/app-button";
import { AppInput } from "@/components/app/app-input";
import { PlayCard } from "@/components/app/play-card";
import { RoleScreenHeader } from "@/components/app/role-screen-header";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import type { Play } from "@/services/plays.service";
import type { Employee } from "@/services/employees.service";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BossScreen() {
  const router = useRouter();
  const { data: user } = useAuthMe();
  const bossId = user ? Number(user.id) : undefined;
  const { data: list, isLoading, isError, refetch } = useListByBossId(bossId);
  const createList = useCreateList({
    onSuccess: () => refetch(),
  });

  const plays = (list?.plays ?? []) as Play[];
  const hasList = list != null;

  const {
    data: employees,
    isLoading: isLoadingEmployees,
    isError: isErrorEmployees,
  } = useEmployeesByBossId(bossId);

  const { data: listsFiltered = [] } = useListsFiltered(
    { bossId: bossId ?? undefined },
    { enabled: !!bossId },
  );

  const [search, setSearch] = useState("");
  const [openListeroId, setOpenListeroId] = useState<number | null>(null);

  const playsByUserId = useMemo(() => {
    const map: Record<number, Play[]> = {};
    for (const list of listsFiltered) {
      const uid = (list as { userId?: number | null }).userId;
      if (typeof uid !== "number") continue;
      const listPlays = (list.plays ?? []) as Play[];
      if (!map[uid]) map[uid] = [];
      map[uid].push(...listPlays);
    }
    return map;
  }, [listsFiltered]);

  const filteredEmployees: Employee[] = useMemo(() => {
    const all = employees ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return all;
    return all.filter((employee, index) => {
      const username = employee.username ?? "";
      const email = employee.email ?? "";
      const fallback = `listero ${index + 1}`;
      const haystack = `${username} ${email} ${fallback}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [employees, search]);

  // Aseguramos que al volver de agregar jugada se refresque la lista completa.
  useFocusEffect(
    useCallback(() => {
      if (bossId != null) {
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

  if (isError) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#faf8ef" }}
        edges={["top"]}
      >
        <Box className="flex-1 justify-center items-center p-6">
          <Text className="text-center text-[#776e65] mb-4">
            No se pudo cargar la lista.
          </Text>
          <AppButton label="Reintentar" onPress={() => refetch()} />
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
          <RoleScreenHeader title="Jugadas de mis listeros (Boss)" />

          <HStack className="justify-end">
            <AppButton
              label="Ver resumen por fecha"
              onPress={() => router.push("/bolita/boss/history")}
            />
          </HStack>

          {!hasList && (
            <Box className="py-6">
              <Text className="text-center text-[#776e65] mb-4">
                Aún no tienes una lista. Créala para empezar a acumular las
                jugadas que recogen tus listeros.
              </Text>
              <AppButton
                label="Crear lista"
                onPress={() => createList.mutate()}
                isLoading={createList.isPending}
              />
            </Box>
          )}

          {hasList && (
            <VStack className="gap-4">
              <VStack className="gap-2">
                <Text className="text-base font-semibold text-[#776e65]">
                  Listeros
                </Text>
                <AppInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Buscar listero por nombre o email"
                />
              </VStack>

              {isLoadingEmployees && (
                <Box className="py-4">
                  <Text className="text-center text-[#776e65]">
                    Cargando listeros…
                  </Text>
                </Box>
              )}

              {isErrorEmployees && (
                <Box className="py-4">
                  <Text className="text-center text-[#776e65]">
                    No se pudieron cargar los listeros.
                  </Text>
                </Box>
              )}

              {!isLoadingEmployees &&
                !isErrorEmployees &&
                (filteredEmployees.length === 0 ? (
                  <Box className="py-4">
                    <Text className="text-center text-[#999]">
                      No hay listeros que coincidan con la búsqueda.
                    </Text>
                  </Box>
                ) : (
                  <VStack className="gap-0">
                    {filteredEmployees.map((employee, index) => {
                      const labelBase =
                        employee.username?.trim() ||
                        employee.email?.trim() ||
                        `Listero ${index + 1}`;
                      const employeePlaysFromApi: Play[] = (
                        employee.lists ?? []
                      ).flatMap((l) => (l.plays ?? []) as Play[]);
                      const employeePlaysFromFilter: Play[] =
                        playsByUserId[employee.id] ?? [];
                      const employeePlays: Play[] =
                        employeePlaysFromApi.length > 0
                          ? employeePlaysFromApi
                          : employeePlaysFromFilter.length > 0
                            ? employeePlaysFromFilter
                            : plays;
                      const isOpen = openListeroId === employee.id;

                      return (
                        <Box
                          key={employee.id}
                          className="mb-2 overflow-hidden rounded-lg border border-[#ddd] bg-white"
                        >
                          <Pressable
                            onPress={() =>
                              setOpenListeroId((prev) =>
                                prev === employee.id ? null : employee.id,
                              )
                            }
                            className="w-full flex-row items-center justify-between py-3 px-4"
                          >
                            <Text
                              numberOfLines={1}
                              className="flex-1 text-base font-bold text-[#776e65]"
                            >
                              {labelBase}
                            </Text>
                            <MaterialIcons
                              name="keyboard-arrow-down"
                              size={24}
                              color="#776e65"
                              style={{
                                transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
                              }}
                            />
                          </Pressable>
                          {isOpen && (
                            <Box className="border-t border-[#eee] pt-1 pb-3 px-4">
                              {employeePlays.length === 0 ? (
                                <Text className="text-sm text-[#999]">
                                  Este listero aún no tiene jugadas en esta
                                  lista.
                                </Text>
                              ) : (
                                <VStack className="gap-0">
                                  {employeePlays.map((play) => (
                                    <PlayCard key={play.id} play={play} />
                                  ))}
                                </VStack>
                              )}
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </VStack>
                ))}
            </VStack>
          )}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
