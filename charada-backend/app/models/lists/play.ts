import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import List from '#models/lists/list'
import PlayType from '#models/lists/play_type'

export default class Play extends BaseModel {
  static table = 'plays'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare listId: number

  @column()
  declare typePlayId: number

  // fijo:    solo 'fijo'                     (01–99)
  // corrido: 'fijo' + 'corrido'              (01–99 cada uno)
  // parle:   'fijo' + 'corrido' + 'parle'    (01–99 cada uno)
  @column()
  declare fijo: number

  @column()
  declare corrido: number | null

  @column()
  declare parle: number | null

  @column()
  declare amount: number

  @column.date()
  declare date: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => List)
  declare list: BelongsTo<typeof List>

  @belongsTo(() => PlayType)
  declare typePlay: BelongsTo<typeof PlayType>
}
