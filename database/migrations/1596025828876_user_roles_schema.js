'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserRolesSchema extends Schema {
  up () {
    this.table('user_role_relations', (table) => {
      table.integer('company_id');
    })
  }

  down () {
    this.table('user_roles', (table) => {
      // reverse alternations
    })
  }
}

module.exports = UserRolesSchema
