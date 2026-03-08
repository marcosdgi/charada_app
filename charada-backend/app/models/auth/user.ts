import { DateTime } from 'luxon'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import hash from '@adonisjs/core/services/hash'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Role from '#models/auth/role'
import List from '#models/lists/list'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
    uids: ['email'],
    passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {

    static table = "users"

    static accessTokens = DbAccessTokensProvider.forModel(User)

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare username: string

    @column()
    declare email: string

    @column({ serializeAs: null })
    declare password: string

    @column()
    declare roleId: number

    // FK al boss (roleId=3). Solo aplica para usuarios roleId=4 (employees)
    @column()
    declare bossId: number | null

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @belongsTo(() => Role)
    declare role: BelongsTo<typeof Role>

    // El boss al que pertenece este employee (roleId=4 → roleId=3)
    @belongsTo(() => User, { foreignKey: 'bossId' })
    declare boss: BelongsTo<typeof User>

    // Los employees que supervisa este boss (roleId=3 → roleId=4)
    @hasMany(() => User, { foreignKey: 'bossId' })
    declare employees: HasMany<typeof User>

    // Las listas del employee (roleId=4)
    @hasMany(() => List)
    declare lists: HasMany<typeof List>

}
