import { AppButton } from "@/components/app/app-button";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const SECRET_TAPS_NEEDED = 2;
const SECRET_LONG_PRESS_MS = 3000;

export default function Index() {
  const router = useRouter();
  const tapCountRef = useRef(0);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTapsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextPressRef = useRef(false);

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const clearResetTapsTimer = () => {
    if (resetTapsTimerRef.current) {
      clearTimeout(resetTapsTimerRef.current);
      resetTapsTimerRef.current = null;
    }
  };

  const onVersionPress = () => {
    if (skipNextPressRef.current) {
      skipNextPressRef.current = false;
      return;
    }
    if (tapCountRef.current < SECRET_TAPS_NEEDED) {
      clearResetTapsTimer();
      tapCountRef.current += 1;
      if (tapCountRef.current < SECRET_TAPS_NEEDED) {
        resetTapsTimerRef.current = setTimeout(() => {
          tapCountRef.current = 0;
          resetTapsTimerRef.current = null;
        }, 2000);
      }
    }
  };

  const onVersionPressIn = () => {
    if (tapCountRef.current === SECRET_TAPS_NEEDED) {
      longPressTimerRef.current = setTimeout(() => {
        longPressTimerRef.current = null;
        skipNextPressRef.current = true;
        tapCountRef.current = 0;
        router.replace("/bolita/home");
      }, SECRET_LONG_PRESS_MS);
    }
  };

  const onVersionPressOut = () => {
    clearLongPressTimer();
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#faf8ef" }}
      edges={["top"]}
    >
      <Box className="flex-1 justify-between px-6 pt-4 pb-8">
        <Box />
        <Box
          className="items-center w-full flex-shrink-0"
          style={{ overflow: "visible" }}
        >
          <Text
            className="text-center font-bold mb-1"
            style={{
              fontSize: 72,
              lineHeight: 86,
              color: "#776e65",
            }}
          >
            2048
          </Text>
          <Text
            className="text-center mb-10"
            style={{ fontSize: 18, color: "#776e65", opacity: 0.85 }}
          >
            Join the tiles, get to 2048!
          </Text>

          <Box
            className="gap-5 w-full max-w-sm p-6 rounded-2xl"
            style={{
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "rgba(119, 110, 101, 0.15)",
              shadowColor: "#bbada0",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <AppButton
              className="h-14 rounded-xl"
              textClassName="text-lg font-bold"
              label="Play"
              onPress={() => router.push("/(game)/play")}
            />
            <Text
              size="sm"
              className="text-center leading-5"
              style={{ color: "#776e65", opacity: 0.9 }}
            >
              Swipe to move tiles. When two tiles with the same number touch,
              they merge into one!
            </Text>
          </Box>
        </Box>

        <Pressable
          className="self-center p-3"
          onPress={onVersionPress}
          onPressIn={onVersionPressIn}
          onPressOut={onVersionPressOut}
        >
          <Text
            className="text-sm"
            style={{ color: "#776e65", opacity: 0.5 }}
          >
            Classic Puzzle Game • v1.0.0
          </Text>
        </Pressable>
      </Box>
    </SafeAreaView>
  );
}
