'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WorkoutsSchema extends Schema {
  up () {
    this.table('workouts', (table) => {
      table.string('name')
      table.string('description')
      table.string('activity_level')
      table.string('type')
      table.dropColumn('assigned_to')
      table.dropColumn('exercise_id')
      table.dropColumn('role_id')
    })
  }

  down () {
    this.table('workouts', (table) => {
      table.dropColumn('name')
      table.dropColumn('description')
      table.dropColumn('activity_level')
      table.dropColumn('type')
      table.integer('assigned_to')
      table.integer('exercise_id')
      table.integer('role_id')
    })
  }
}

module.exports = WorkoutsSchema
