'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExerciseGroupsSchema extends Schema {
  up () {
    this.create('exercise_groups', (table) => {
      table.increments()
      table.string('name')
      table.integer('workout_id')
    })
  }

  down () {
    this.drop('exercise_groups')
  }
}

module.exports = ExerciseGroupsSchema
