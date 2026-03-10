import { Stack } from 'expo-router';

export default function BolitaLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="home" />
      <Stack.Screen name="boss" />
      <Stack.Screen name="listero" />
      <Stack.Screen name="bank" />
    </Stack>
  );
}
