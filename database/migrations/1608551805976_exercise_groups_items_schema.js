'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExerciseGroupsItemsSchema extends Schema {
  up () {
    this.create('exercise_groups_items', (table) => {
      table.increments('id')
      .unsigned()
      .notNullable()
      .primary();

      table.integer('group_id')
      .unsigned()
      .references('id')
      .inTable('exercise_groups')
      .notNullable()
      .onDelete('CASCADE');

      table.integer('exercise_id')
      .unsigned()
      .references('id')
      .inTable('exercises')
      .notNullable()
      .onDelete('CASCADE');

      table.integer('order').unsigned()
    })
  }

  down () {
    this.drop('exercise_groups_items')
  }
}

module.exports = ExerciseGroupsItemsSchema
