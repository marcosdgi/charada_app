import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ListsController = () => import('#controllers/list/lists_controller')

router
  .group(() => {
    router.get('/boss/:bossId', [ListsController, 'getListByBossId']).where('bossId', router.matchers.number())
  })
  .prefix('api/v1/lists')
  .use(middleware.auth())