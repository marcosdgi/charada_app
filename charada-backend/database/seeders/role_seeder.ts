import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/auth/role'

export default class extends BaseSeeder {
  async run() {
    const roles = [
      { id: 1, name: 'super admin' },
      { id: 2, name: 'admin' },
      { id: 3, name: 'boss' },
      { id: 4, name: 'employee' },
    ]

    await Role.updateOrCreateMany('id', roles)
  }
}