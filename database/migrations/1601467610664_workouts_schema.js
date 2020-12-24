'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WorkoutsSchema extends Schema {
  up () {
    this.table('workouts', (table) => {
      table.boolean('is_system_default')
    })
  }

  down () {
    this.table('workouts', (table) => {
      table.dropColumn('is_system_default')
    })
  }
}

module.exports = WorkoutsSchema
