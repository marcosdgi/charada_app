import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lists'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('identification').notNullable().defaultTo('Lista')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('identification')
    })
  }
}