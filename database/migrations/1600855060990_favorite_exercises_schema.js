'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FavoriteExercisesSchema extends Schema {
  up () {
    this.create('favorite_exercises', (table) => {
      table.increments()
      table.integer('user_id')
      table.integer('exercise_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('favorite_exercises')
  }
}

module.exports = FavoriteExercisesSchema
