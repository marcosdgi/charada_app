import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'plays'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('list_id')
        .unsigned()
        .references('id')
        .inTable('lists')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('type_play_id')
        .unsigned()
        .references('id')
        .inTable('play_types')
        .onDelete('RESTRICT')
        .notNullable()
      // fijo:    solo el número 'fijo'           (01-99)
      // corrido: 'fijo' + 'corrido'              (01-99 cada uno)
      // parle:   'fijo' + 'corrido' + 'parle'    (01-99 cada uno)
      table.integer('fijo').unsigned().notNullable()
      table.integer('corrido').unsigned().nullable()
      table.integer('parle').unsigned().nullable()
      table.decimal('amount', 10, 2).unsigned().notNullable()
      table.date('date').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
