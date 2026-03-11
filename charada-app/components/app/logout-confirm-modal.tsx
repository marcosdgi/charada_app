import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Modal } from "react-native";

type LogoutConfirmModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function LogoutConfirmModal({
  isOpen,
  isLoading = false,
  onClose,
  onConfirm,
}: LogoutConfirmModalProps) {
  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <Box className="flex-1 items-center justify-center px-6">
        <Pressable className="absolute inset-0 bg-black/50" onPress={onClose} />
        <VStack className="w-full max-w-[360px] rounded-lg border border-[#d8cfc4] bg-white p-6">
          <Text className="text-base font-semibold text-[#776e65]">
            Cerrar sesión
          </Text>
          <Text className="mt-3 text-[#776e65]">
            ¿Estás seguro de cerrar sesión?
          </Text>
          <HStack className="mt-6 justify-end gap-2">
            <Button
              variant="outline"
              action="secondary"
              onPress={onClose}
              disabled={isLoading}
              className="border-[#d8cfc4]"
            >
              <Text className="font-medium text-[#776e65]">Cancelar</Text>
            </Button>
            <Button
              action="negative"
              onPress={onConfirm}
              disabled={isLoading}
              className="bg-[#8f7a66]"
            >
              <Text className="font-semibold text-[#f9f6f2]">
                {isLoading ? "Cerrando..." : "Cerrar sesión"}
              </Text>
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Modal>
  );
}
