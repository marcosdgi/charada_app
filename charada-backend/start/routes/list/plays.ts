import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const PlaysController = () => import('#controllers/list/plays_controller')

router
  .group(() => {
    router.post('/', [PlaysController, 'create'])
    router.put('/:id', [PlaysController, 'update']).where('id', router.matchers.number())
    router.delete('/:id', [PlaysController, 'delete']).where('id', router.matchers.number())
    router.get('/date/:date', [PlaysController, 'listPlaysByDate'])
    router.get('/list/:listId', [PlaysController, 'listPlaysByListId']).where('listId', router.matchers.number())
  })
  .prefix('api/v1/plays')
  .use(middleware.auth())
