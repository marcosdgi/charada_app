import { Stack } from 'expo-router';

export default function BossLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add-play" />
      <Stack.Screen name="history" />
    </Stack>
  );
}
