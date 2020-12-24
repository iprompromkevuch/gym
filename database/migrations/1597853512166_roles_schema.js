'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RolesSchema extends Schema {
  up () {
    this.table('roles', (table) => {
      table.integer('weight');
    })
  }

  down () {
    this.table('roles', (table) => {
      // reverse alternations
    })
  }
}

module.exports = RolesSchema
