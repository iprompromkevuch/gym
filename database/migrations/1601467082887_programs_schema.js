'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProgramsSchema extends Schema {
  up () {
    this.table('programs', (table) => {
      table.boolean('is_system_default')
    })
  }

  down () {
    this.table('programs', (table) => {
      table.dropColumn('is_system_default')
    })
  }
}

module.exports = ProgramsSchema;
