'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ForecastProgramRelationsSchema extends Schema {
  up () {
    this.create('forecast_program_relations', (table) => {
      table.increments()
      table.integer('forecast_id')
      table.integer('program_id')
    })
  }

  down () {
    this.drop('forecast_program_relations')
  }
}

module.exports = ForecastProgramRelationsSchema
