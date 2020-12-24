'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExerciseWorkoutRelationsSchema extends Schema {
  up () {
    this.create('exercise_workout_relations', (table) => {
      table.increments()
      table.integer('exercise_id')
      table.integer('workout_id')
    })
  }

  down () {
    this.drop('exercise_workout_relations')
  }
}

module.exports = ExerciseWorkoutRelationsSchema
