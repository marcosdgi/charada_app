import { BaseSeeder } from '@adonisjs/lucid/seeders'
import PlayType from '#models/lists/play_type'

export default class extends BaseSeeder {
  async run() {
    const playTypes = [
      { id: 1, name: 'fijo', numbersCount: 1 },
      { id: 2, name: 'corrido', numbersCount: 2 },
      { id: 3, name: 'parle', numbersCount: 3 },
    ]

    await PlayType.updateOrCreateMany('id', playTypes)
  }
}
