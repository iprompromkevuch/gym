'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExerciseGroupsItemsSchema extends Schema {
  up () {
    this.create('exercise_groups_items', (table) => {
      table.increments()
      table.integer('group_id')
      table.integer('exercise_id')
    })
  }

  down () {
    this.drop('exercise_groups_items')
  }
}

module.exports = ExerciseGroupsItemsSchema
