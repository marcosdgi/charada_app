import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

const timeRestriction = vine.createRule<Record<string, unknown>>((_value, _options, field) => {
  const now = DateTime.utc()
  const start = now.set({ hour: 13, minute: 25, second: 0, millisecond: 0 })
  const end = now.set({ hour: 21, minute: 25, second: 0, millisecond: 0 })

  if (now >= start && now <= end) {
    field.report(
      'En este horario no se pueden recibir peticiones de jugadas.',
      'time_restriction',
      field
    )
  }
})

export const updatePlayValidator = vine.compile(
  vine
    .object({
      fijo: vine.number().min(1).max(99),
      corrido: vine.number().min(1).max(99).nullable().optional(),
      parle: vine.number().min(1).max(99).nullable().optional(),
      amount: vine.number().positive(),
    })
    .use(timeRestriction({}))
)

export const createPlayValidator = vine.compile(
  vine
    .object({
      listId: vine.number(),
      typePlayId: vine.number(),
      fijo: vine.number().min(1).max(99),
      corrido: vine.number().min(1).max(99).nullable().optional(),
      parle: vine.number().min(1).max(99).nullable().optional(),
      amount: vine.number().positive(),
      date: vine.date().transform((value) => DateTime.fromJSDate(value)),
    })
    .use(timeRestriction({}))
)
