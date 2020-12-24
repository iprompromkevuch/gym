'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProgramsSchema extends Schema {
  up () {
    this.table('programs', (table) => {
      table.dropColumn('user_id');
    })
  }

  down () {
    this.table('programs', (table) => {
      table.integer('user_id');
    })
  }
}

module.exports = ProgramsSchema
