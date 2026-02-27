import type { HttpContext } from '@adonisjs/core/http'
import { registerValidator, loginValidator } from '#validators/auth_validator'
import User from '#models/auth/user'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    const user = await User.create(data)

    const token = await User.accessTokens.create(user)

    return response.created({
      user,
      token,
    })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    const token = await User.accessTokens.create(user)

    return response.ok({
      user,
      token,
    })
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const token = user.currentAccessToken

    await User.accessTokens.delete(user, token.identifier)

    return response.ok({ message: 'Sesión cerrada correctamente' })
  }

  async me({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    return response.ok(user)
  }
}
