import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'plays'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('name').notNullable().defaultTo('jugada')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}