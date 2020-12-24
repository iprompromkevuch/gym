'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProgramsSchema extends Schema {
  up () {
    this.table('programs', (table) => {
      table.dropColumn('number_phases');
      table.integer('workout_sessions_per_week').notNullable().defaultTo(3);
    })
  }

  down () {
    this.table('programs', (table) => {
      table.integer('number_phases');
      table.dropColumn('workout_sessions_per_week');
    })
  }
}

module.exports = ProgramsSchema
