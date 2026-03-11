import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'plays'

  async up() {
    const hasTable = await this.schema.hasTable(this.tableName)
    const hasColumn = await this.schema.hasColumn(this.tableName, 'name')

    if (hasTable && !hasColumn) {
      this.schema.alterTable(this.tableName, (table) => {
        table.string('name').notNullable().defaultTo('jugada')
      })
    }
  }

  async down() {
    const hasTable = await this.schema.hasTable(this.tableName)
    const hasColumn = await this.schema.hasColumn(this.tableName, 'name')

    if (hasTable && hasColumn) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropColumn('name')
      })
    }
  }
}