'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExerciseGroupsItemsSchema extends Schema {
  up () {
    this.drop('exercise_groups_items');
  }

  down () {
    this.create('exercise_groups_items', (table) => {
      table.increments()
      table.integer('group_id').unsigned()
      table.integer('exercise_id').unsigned()
      table.integer('order').unsigned()
    })
  }
}

module.exports = ExerciseGroupsItemsSchema
