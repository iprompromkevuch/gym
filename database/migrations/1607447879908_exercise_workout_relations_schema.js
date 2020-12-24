'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExerciseWorkoutRelationsSchema extends Schema {
  up () {
    this.drop('exercise_workout_relations')
  }

  down () {
    this.create('exercise_workout_relations', (table) => {
      table.increments()
      table.integer('exercise_id').notNullable()
      table.integer('workout_id').notNullable()
    })
  }
}

module.exports = ExerciseWorkoutRelationsSchema
