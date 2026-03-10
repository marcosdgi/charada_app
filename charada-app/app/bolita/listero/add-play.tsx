import { PlayForm } from '@/components/app/play-form';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ListeroAddPlayScreen() {
  const router = useRouter();
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const listIdNum = listId ? Number(listId) : NaN;

  if (!listId || Number.isNaN(listIdNum)) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#faf8ef' }} edges={['top']}>
        <Box className="flex-1 justify-center items-center p-6">
          <Text className="text-[#776e65]">Lista no válida.</Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#faf8ef' }} edges={['top']}>
      <Box className="flex-1 p-4">
        <Text className="text-lg font-bold text-[#776e65] mb-4">
          Nueva jugada
        </Text>
        <PlayForm
          listId={listIdNum}
          onSuccess={() => router.back()}
          onCancel={() => router.back()}
        />
      </Box>
    </SafeAreaView>
  );
}
