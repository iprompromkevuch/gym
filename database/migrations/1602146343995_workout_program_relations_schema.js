'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WorkoutProgramRelationsSchema extends Schema {
  up () {
    this.create('workout_program_relations', (table) => {
      table.increments()
      table.integer('program_id')
      table.integer('workout_id')
    })
  }

  down () {
    this.drop('workout_program_relations')
  }
}

module.exports = WorkoutProgramRelationsSchema
