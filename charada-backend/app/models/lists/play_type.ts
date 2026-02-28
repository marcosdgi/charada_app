import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Play from '#models/lists/play'

export default class PlayType extends BaseModel {
  static table = 'play_types'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare numbersCount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Play)
  declare plays: HasMany<typeof Play>
}
