'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExercisesSchema extends Schema {
  up () {
    this.create('exercises', (table) => {
      table.increments()
      table.integer('primary_muscle_id')
      //table.string('ability_level', 200)
      table.string('type', 200)
      table.string('name', 200)
      table.text('description')
      table.integer('created_by')
      table.integer('role_id')
      table.integer('company_id')
      table.boolean('is_system_default').notNullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('exercises')
  }
}

module.exports = ExercisesSchema
