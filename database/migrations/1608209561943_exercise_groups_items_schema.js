'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExerciseGroupsItemsSchema extends Schema {
  up () {
    this.table('exercise_groups_items', (table) => {
      table
      .integer('order')
      .unsigned()
    })
  }

  down () {
    this.table('exercise_groups_items', (table) => {
      table.dropColumn('order')
    })
  }
}

module.exports = ExerciseGroupsItemsSchema
