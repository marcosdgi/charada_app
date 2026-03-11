import React, { useState } from 'react';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { AppButton } from '@/components/app/app-button';
import { AppInput } from '@/components/app/app-input';
import { useToast, Toast, ToastTitle, ToastDescription } from '@/components/ui/toast';
import { useCreatePlay } from '@/api/use-plays';
import { getTodayUTC } from '@/lib/date-utc';
import { TYPE_PLAY_ID, TYPE_PLAY_LABELS } from '@/lib/plays';
import type { CreatePlayPayload } from '@/services/plays.service';

type PlayFormProps = {
  listId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function PlayForm({ listId, onSuccess, onCancel }: PlayFormProps) {
  const [date, setDate] = useState(getTodayUTC());
  const [typePlayId, setTypePlayId] = useState<1 | 2 | 3>(TYPE_PLAY_ID.FIJO);
  const [fijo, setFijo] = useState('');
  const [corrido, setCorrido] = useState('');
  const [parle, setParle] = useState('');
  const [amount, setAmount] = useState('');
   const [name, setName] = useState('');

  const createPlay = useCreatePlay();
  const toast = useToast();

  const handleSubmit = async () => {
    const fijoNum = Number(fijo);
    const amountNum = Number(amount);
    if (!date || Number.isNaN(fijoNum) || Number.isNaN(amountNum)) return;

    const payload: CreatePlayPayload = {
      listId,
      typePlayId,
      fijo: fijoNum,
      amount: amountNum,
      date,
      name: name.trim() || undefined,
    };
    if (typePlayId === TYPE_PLAY_ID.CORRIDO) {
      const c = Number(corrido);
      if (!Number.isNaN(c)) payload.corrido = c;
    }
    if (typePlayId === TYPE_PLAY_ID.PARLE) {
      const p = Number(parle);
      if (!Number.isNaN(p)) payload.parle = p;
    }

    try {
      await createPlay.mutateAsync(payload);
      onSuccess?.();
    } catch (error: any) {
      const message =
        (error?.response?.data as { message?: string })?.message ||
        error?.message ||
        'No se pudo guardar la jugada.';

      toast.show({
        placement: 'top',
        duration: 4000,
        render: () => (
          <Toast action="error" variant="solid" className="max-w-[360px]">
            <ToastTitle>Error al guardar jugada</ToastTitle>
            <ToastDescription>{message}</ToastDescription>
          </Toast>
        ),
      });
    }
  };

  const errorMessage = createPlay.isError && createPlay.error?.message
    ? createPlay.error.message
    : null;

  return (
    <VStack className="gap-4 p-4">
      <Text className="text-base font-semibold text-[#776e65]">Fecha</Text>
      <AppInput
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
        containerClassName="mb-1"
      />

      <Text className="text-base font-semibold text-[#776e65]">Tipo de jugada</Text>
      <HStack className="gap-2 flex-wrap">
        {([TYPE_PLAY_ID.FIJO, TYPE_PLAY_ID.CORRIDO, TYPE_PLAY_ID.PARLE] as const).map(
          (id) => (
            <AppButton
              key={id}
              label={TYPE_PLAY_LABELS[id]}
              onPress={() => setTypePlayId(id)}
              className={typePlayId === id ? '' : 'bg-transparent border border-[#8f7a66]'}
              textClassName={typePlayId === id ? 'text-[#f9f6f2]' : 'text-[#8f7a66]'}
            />
          )
        )}
      </HStack>

      <Text className="text-base font-semibold text-[#776e65]">Fijo</Text>
      <AppInput
        value={fijo}
        onChangeText={setFijo}
        placeholder="Número"
        keyboardType="numeric"
        containerClassName="mb-1"
      />

      {typePlayId === TYPE_PLAY_ID.CORRIDO && (
        <>
          <Text className="text-base font-semibold text-[#776e65]">Corrido</Text>
          <AppInput
            value={corrido}
            onChangeText={setCorrido}
            placeholder="Número"
            keyboardType="numeric"
            containerClassName="mb-1"
          />
        </>
      )}

      {typePlayId === TYPE_PLAY_ID.PARLE && (
        <>
          <Text className="text-base font-semibold text-[#776e65]">Parle</Text>
          <AppInput
            value={parle}
            onChangeText={setParle}
            placeholder="Número"
            keyboardType="numeric"
            containerClassName="mb-1"
          />
        </>
      )}

      <Text className="text-base font-semibold text-[#776e65]">Monto</Text>
      <AppInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Monto"
        keyboardType="numeric"
        containerClassName="mb-1"
      />

      <Text className="text-base font-semibold text-[#776e65]">
        Nombre de quien anotas la jugada
      </Text>
      <AppInput
        value={name}
        onChangeText={setName}
        placeholder="Ej: Juan, Cliente 3, etc."
        containerClassName="mb-1"
      />

      {errorMessage ? (
        <Text className="text-sm text-red-600 mt-1">{errorMessage}</Text>
      ) : null}

      <HStack className="gap-3 mt-2">
        <AppButton
          label="Guardar jugada"
          onPress={handleSubmit}
          isLoading={createPlay.isPending}
          className="flex-1"
        />
        {onCancel && (
          <AppButton
            label="Cancelar"
            onPress={onCancel}
            className="flex-1 bg-transparent border border-[#8f7a66]"
            textClassName="text-[#8f7a66]"
          />
        )}
      </HStack>
    </VStack>
  );
}
