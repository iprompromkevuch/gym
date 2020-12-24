'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExerciseGroupsSchema extends Schema {
  up () {
    this.table('exercise_groups', (table) => {
      table
      .integer('order')
      .unsigned()
    })
  }

  down () {
    this.table('exercise_groups', (table) => {
      table.dropColumn('order')
    })
  }
}

module.exports = ExerciseGroupsSchema
