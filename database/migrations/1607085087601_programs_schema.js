'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProgramsSchema extends Schema {
  up () {
    this.table('programs', (table) => {
      table.string('fitness_level').notNullable().defaultTo('beginner');
      table.string('gender').notNullable().defaultTo('male');
    })
  }

  down () {
    this.table('programs', (table) => {
      table.dropColumn("fitness_level");
      table.dropColumn("gender");
    })
  }
}

module.exports = ProgramsSchema
