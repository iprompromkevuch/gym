'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserExerciseRelationsSchema extends Schema {
  up () {
    this.create('workouts', (table) => {
      table.increments()
      table.integer('user_id')
      table.integer('exercise_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('workouts')
  }
}

module.exports = UserExerciseRelationsSchema
