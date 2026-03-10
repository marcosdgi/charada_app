import { useLogout } from "@/api/use-auth";
import { Button } from "@/components/ui/button";
import { LogoutConfirmModal } from "@/components/app/logout-confirm-modal";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";

type RoleScreenHeaderProps = {
  title: string;
};

export function RoleScreenHeader({ title }: RoleScreenHeaderProps) {
  const router = useRouter();
  const logout = useLogout();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const closeLogoutDialog = () => {
    if (!logout.isPending) {
      setIsLogoutDialogOpen(false);
    }
  };

  const handleConfirmLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setIsLogoutDialogOpen(false);
        router.replace("/bolita/login");
      },
    });
  };

  return (
    <>
      <HStack className="items-center justify-between">
        <Text className="text-xl font-bold text-[#776e65]">{title}</Text>
        <Button
          variant="outline"
          action="secondary"
          size="sm"
          onPress={() => setIsLogoutDialogOpen(true)}
          className="h-10 w-10 rounded-full border-[#d8cfc4] bg-white p-0"
        >
          <MaterialIcons name="power-settings-new" size={20} color="#776e65" />
        </Button>
      </HStack>

      <LogoutConfirmModal
        isOpen={isLogoutDialogOpen}
        isLoading={logout.isPending}
        onClose={closeLogoutDialog}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
