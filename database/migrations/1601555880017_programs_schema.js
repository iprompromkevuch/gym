'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProgramsSchema extends Schema {
  up () {
    this.table('programs', (table) => {
      table.integer('company_id')
      table.integer('created_by')
    })
  }

  down () {
    this.table('programs', (table) => {
      table.dropColumn('company_id')
      table.dropColumn('created_by')
    })
  }
}

module.exports = ProgramsSchema
