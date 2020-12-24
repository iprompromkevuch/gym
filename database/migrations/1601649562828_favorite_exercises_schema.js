'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FavoriteExercisesSchema extends Schema {
  up () {
    this.table('favorite_exercises', (table) => {
      table.index('exercise_id');
    })
  }

  down () {
    this.table('favorite_exercises', (table) => {
      table.dropIndex('exercise_id');
    })
  }
}

module.exports = FavoriteExercisesSchema
