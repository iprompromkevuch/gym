'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FavoriteWorkoutsSchema extends Schema {
  up () {
    this.create('favorite_workouts', (table) => {
      table.increments()
      table.integer('workout_id')
      table.integer('user_id')
    })
  }

  down () {
    this.drop('favorite_workouts')
  }
}

module.exports = FavoriteWorkoutsSchema
