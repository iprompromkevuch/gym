'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FavoriteExercisesSchema extends Schema {
  up () {
    this.create('favorite_exercises', (table) => {
      table
      .increments('id')
      .unsigned()
      .notNullable()
      .primary();

      table.integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
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
    this.drop('favorite_exercises')
  }
}

module.exports = FavoriteExercisesSchema
