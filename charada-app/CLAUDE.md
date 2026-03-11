# Patrones de UI del proyecto

Este archivo define las reglas de implementación de UI que debemos seguir en el proyecto.

## Reglas base

- Usar **gluestack** como base de componentes y estilos.
- Evitar crear UI directa con `TextInput`, `TouchableOpacity`, `View` o `Text` de React Native cuando ya exista alternativa en `components/ui` o `components/app`.
- Antes de crear un componente nuevo, revisar primero si ya existe en:
  - `components/app` (componentes propios de la app)
  - `components/ui` (base gluestack)

## Composición de componentes

- Para texto, usar `Text` desde `components/ui/text`.
- Para layout, preferir:
  - `VStack` (`components/ui/vstack`) para estructura vertical.
  - `HStack` (`components/ui/hstack`) para estructura horizontal.
- Usar `Box` solo cuando `VStack/HStack` no apliquen claramente.

## Componentes propios de app

- Crear componentes personalizados en `components/app/*` partiendo de componentes gluestack.
- Mantener `components/ui/*` como capa base (no duplicar lógica de UI en pantallas).
- Ejemplos actuales:
  - `AppButton` en `components/app/app-button.tsx` (base `ui/button`)
  - `AppInput` en `components/app/app-input.tsx` (base `ui/input`)

## Regla para nuevas pantallas

- Al construir una pantalla nueva:
  1. Componer con `VStack/HStack` y `Text` de UI.
  2. Reutilizar componentes en `components/app`.
  3. Si falta un patrón (botón, input, card, etc.), crearlo en `components/app` usando gluestack como base.
