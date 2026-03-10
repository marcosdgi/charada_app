import { useAuthMe } from "@/api/use-auth";
import { RoleScreenHeader } from "@/components/app/role-screen-header";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { ROLE_ID } from "@/lib/roles";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BolitaHomeScreen() {
  const router = useRouter();
  const { data: user, isSuccess, isLoading, isError } = useAuthMe();

  const roleId = user?.roleId ?? ROLE_ID.SUPER_ADMIN;
  const shouldRedirectToBoss = roleId === ROLE_ID.BOSS;
  const shouldRedirectToListero = roleId === ROLE_ID.LISTERO;
  const isAuthenticated = isSuccess && !!user;
  const shouldRedirectToLogin = (isSuccess && !user) || isError;
  const isResolvingRoute =
    isLoading ||
    (isAuthenticated && (shouldRedirectToBoss || shouldRedirectToListero));

  useEffect(() => {
    if (shouldRedirectToLogin) {
      router.replace("/bolita/login");
      return;
    }
    if (!isAuthenticated) return;
    if (shouldRedirectToBoss) {
      router.replace("/bolita/boss");
      return;
    }
    if (shouldRedirectToListero) {
      router.replace("/bolita/listero");
      return;
    }
  }, [
    shouldRedirectToLogin,
    isAuthenticated,
    shouldRedirectToBoss,
    shouldRedirectToListero,
    router,
  ]);

  if (isLoading || isResolvingRoute || shouldRedirectToLogin) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#faf8ef" }}
        edges={["top"]}
      >
        <Box className="flex-1 justify-center items-center p-6">
          <Text style={{ fontSize: 16, color: "#776e65" }}>Cargando…</Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#faf8ef" }}
      edges={["top"]}
    >
      <Box className="flex-1 p-6">
        <RoleScreenHeader title="Super Admin" />
        <Box className="flex-1 justify-center items-center">
          <Text
            className="text-center"
            style={{ fontSize: 18, color: "#776e65" }}
          >
            Pantalla de administración (Super Admin)
          </Text>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
