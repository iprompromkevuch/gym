'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PermissionsProgramsSchema extends Schema {
  up () {
    this.create('permissions_programs', (table) => {
      table.increments()
      table.integer('program_id')
      table.integer('company_id')
      table.integer('role_id')
    })
  }

  down () {
    this.drop('permissions_programs')
  }
}

module.exports = PermissionsProgramsSchema
