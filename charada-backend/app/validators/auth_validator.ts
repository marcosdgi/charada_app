import vine from '@vinejs/vine'
const roles = [1, 2, 3]

export const registerValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(3).maxLength(100),
    email: vine.string().trim().email().normalizeEmail(),
    password: vine.string().minLength(8).confirmed(),
    roleId: vine.enum(roles),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
    password: vine.string(),
  })
)
