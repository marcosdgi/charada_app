import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ListsController = () => import('#controllers/list/lists_controller')

router
  .group(() => {
    router.post('/', [ListsController, 'createList'])
    router.get('/user/:userId', [ListsController, 'getListByUserId']).where('userId', router.matchers.number())
  })
  .prefix('api/v1/lists')
  .use(middleware.auth())