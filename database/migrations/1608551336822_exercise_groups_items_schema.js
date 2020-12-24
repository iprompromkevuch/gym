'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExerciseGroupsItemsSchema extends Schema {
  up () {
    this.drop('exercise_groups')
  }

  down () {
    this.create('exercise_groups', (table) => {
      table.increments()
      table.string('name')
      table.integer('workout_id')
      table.integer('order').unsigned()
    })
  }
}

module.exports = ExerciseGroupsItemsSchema
