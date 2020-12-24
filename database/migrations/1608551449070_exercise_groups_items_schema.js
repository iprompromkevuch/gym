'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExerciseGroupsItemsSchema extends Schema {
  up () {
    this.create('exercise_groups', (table) => {
      table.increments('id')
      .unsigned()
      .notNullable()
      .primary();

      table.string('name')

      table.integer('workout_id')
      .unsigned()
      .references('id')
      .inTable('workouts')
      .notNullable()
      .onDelete('CASCADE');

      table.integer('order').unsigned()
    })
  }

  down () {
    this.drop('exercise_groups')
  }
}

module.exports = ExerciseGroupsItemsSchema
