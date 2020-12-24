'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserRoleRelationsSchema extends Schema {
  up () {
    this.table('user_role_relations', (table) => {
      table.index('user_id');
    })
  }

  down () {
    this.table('user_role_relations', (table) => {
      table.dropIndex('user_id');
    })
  }
}

module.exports = UserRoleRelationsSchema
