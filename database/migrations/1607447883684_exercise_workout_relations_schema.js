'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExerciseWorkoutRelationsSchema extends Schema {
  up () {
    this.create('exercise_workout_relations', (table) => {
      table
      .increments('id')
      .unsigned()
      .notNullable()
      .primary();

      table.integer('workout_id')
      .unsigned()
      .references('id')
      .inTable('workouts')
      .notNullable()
      .onDelete('CASCADE')

      table.integer('exercise_id')
      .unsigned()
      .references('id')
      .inTable('exercises')
      .notNullable()
      .onDelete('CASCADE')
    })
  }

  down () {
    this.drop('exercise_workout_relations')
  }
}

module.exports = ExerciseWorkoutRelationsSchema
