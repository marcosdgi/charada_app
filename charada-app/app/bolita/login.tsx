import { useLogin } from "@/api/use-auth";
import { AppButton } from "@/components/app/app-button";
import { AppInput } from "@/components/app/app-input";
import { Box } from "@/components/ui/box";
import { KeyboardAvoidingView } from "@/components/ui/keyboard-avoiding-view";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { ROLE_ID } from "@/lib/roles";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BolitaLoginScreen() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email.trim() || !password) {
      Alert.alert("Error", "Introduce email y contraseña");
      return;
    }
    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: (data) => {
          const roleId = data.user?.roleId ?? ROLE_ID.SUPER_ADMIN;
          if (roleId === ROLE_ID.BOSS) {
            router.replace("/bolita/boss");
          } else if (roleId === ROLE_ID.LISTERO) {
            router.replace("/bolita/listero");
          } else {
            router.replace("/bolita/home");
          }
        },
        onError: (err: Error) => {
          Alert.alert("Error", err.message || "No se pudo iniciar sesión");
        },
      },
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#faf8ef" }}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Box className="flex-1 justify-between p-6">
          <Box />
          <Box className="items-center">
            <Text className="text-center text-[80px] font-bold text-[#776e65] mb-2">
              2048
            </Text>
            <Text className="text-center text-lg text-[#776e65] opacity-70 mb-8">
              Join the tiles, get to 2048!
            </Text>

            <Box
              className="gap-4 w-full max-w-sm p-5 rounded-lg bg-white"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <AppInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                editable={!loginMutation.isPending}
              />
              <AppInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
                editable={!loginMutation.isPending}
              />
              <AppButton
                className="mt-2 h-12"
                textClassName="text-lg"
                label="Entrar"
                onPress={handleLogin}
                isLoading={loginMutation.isPending}
              />
            </Box>
          </Box>

          <Pressable
            className="self-center p-2"
            onPress={() => router.back()}
          >
            <Text className="text-sm text-[#776e65] opacity-50">
              Classic Puzzle Game • v1.0.0
            </Text>
          </Pressable>
        </Box>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
