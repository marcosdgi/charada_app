import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth/auth_controller')

router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])

    router
      .group(() => {
        router.post('/logout', [AuthController, 'logout'])
        router.get('/me', [AuthController, 'me'])
      })
      .use(middleware.auth())

    router.get('employees/:bossId', [AuthController, 'getEmployeeByBossId']).where('bossId', router.matchers.number())
  })
  .prefix('api/v1/auth')
