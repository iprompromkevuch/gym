'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserRoleRelationsSchema extends Schema {
  up () {
    this.create('user_role_relations', (table) => {
      table.increments();
      table.integer('user_id');
      table.integer('role_id');
    })
  }

  down () {
    this.drop('user_role_relations')
  }
}

module.exports = UserRoleRelationsSchema
