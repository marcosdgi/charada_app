import List from '#models/lists/list'
import type { HttpContext } from '@adonisjs/core/http'

export default class ListsController {

    async getListByBossId({ params, response }: HttpContext) {
        const bossId = params.bossId

        const list = await List.query()
            .where('user_id', bossId)
            .preload('plays')
            .firstOrFail()
        return response.ok(list)
    }

    async createList({ auth, response }: HttpContext) {
        const user = auth.getUserOrFail()
        const list = await List.create({ userId: user.id })
        return response.created(list)
    }


}