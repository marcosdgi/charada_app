import Play from '#models/lists/play'
import type { HttpContext } from '@adonisjs/core/http'
import { createPlayValidator } from '#validators/play_validator'

export default class PlaysController {

    private PAGES = 15

    async create({ request, response }: HttpContext) {
        const payload = await request.validateUsing(createPlayValidator)
        const play = await Play.create(payload)
        return response.created(play)
    }

    async listPlaysByDate({ params, request, response }: HttpContext) {
        const page = request.input('page', 1)
        const date = params.date
        const plays = await Play.query()
            .where('date', date)
            .preload('typePlay')
            .preload('list')
            .paginate(page, this.PAGES)

        return response.ok(plays)
    }

    async listPlaysByListId({ params, request, response }: HttpContext) {
        const page = request.input('page', 1)
        const listId = params.listId
        const plays = await Play.query()
            .where('list_id', listId)
            .preload('typePlay')
            .paginate(page, this.PAGES)

        return response.ok(plays)
    }


}