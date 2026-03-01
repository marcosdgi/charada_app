import List from '#models/lists/list'
import type { HttpContext } from '@adonisjs/core/http'

export default class ListsController {

    async getListByBossId({ params, response }: HttpContext) {
        const bossId = params.bossId

        const list = await List.query()
            .where('boss_id', bossId)
            .preload('plays')
            .firstOrFail()
        return response.ok(list)
    }


}