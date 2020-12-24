'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProgramsSchema extends Schema {
  up () {
    this.table('programs', (table) => {
      table.integer('weight_loss_goal');
      table.integer('lean_mass_goal');
      table.integer('count_of_weeks');
    })
  }

  down () {
    this.table('programs', (table) => {
      table.dropColumn('weight_loss_goal');
      table.dropColumn('lean_mass_goal');
      table.dropColumn('count_of_weeks');
    })
  }
}

module.exports = ProgramsSchema
