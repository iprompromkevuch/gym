'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExerciseAbilityRelationsSchema extends Schema {
  up () {
    this.create('exercise_ability_relations', (table) => {
      table
      .increments('id')
      .unsigned()
      .notNullable()
      .primary();

      table.integer('ability_id')
      .unsigned()
      .references('id')
      .inTable('abilities')
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
    this.drop('exercise_ability_relations')
  }
}

module.exports = ExerciseAbilityRelationsSchema
