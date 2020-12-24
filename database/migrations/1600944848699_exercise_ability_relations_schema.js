'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExerciseAbilityRelationsSchema extends Schema {
  up () {
    this.create('exercise_ability_relations', (table) => {
      table.increments()
      table.integer('exercise_id').notNullable()
      table.integer('ability_id').notNullable()
    })
  }

  down () {
    this.drop('exercise_ability_relations')
  }
}

module.exports = ExerciseAbilityRelationsSchema
