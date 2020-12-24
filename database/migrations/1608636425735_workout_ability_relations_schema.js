'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WorkoutAbilityRelationsSchema extends Schema {
  up () {
    this.create('workout_ability_relations', (table) => {
      table.increments('id')
      .unsigned()
      .notNullable()
      .primary();

      table.integer('ability_id')
      .unsigned()
      .references('id')
      .inTable('abilities')
      .notNullable()
      .onDelete('CASCADE');

      table.integer('workout_id')
      .unsigned()
      .references('id')
      .inTable('workouts')
      .notNullable()
      .onDelete('CASCADE');
    })
  }

  down () {
    this.drop('workout_ability_relations')
  }
}

module.exports = WorkoutAbilityRelationsSchema
