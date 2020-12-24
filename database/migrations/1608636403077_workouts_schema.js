'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WorkoutsSchema extends Schema {
  up () {
    this.table('workouts', (table) => {
      table.dropColumn('activity_level');
    })
  }

  down () {
    this.table('workouts', (table) => {
      table.string('activity_level');
    })
  }
}

module.exports = WorkoutsSchema
