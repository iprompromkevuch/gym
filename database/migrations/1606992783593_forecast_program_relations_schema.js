'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ForecastProgramRelationsSchema extends Schema {
  up () {
    this.create('forecast_program_relations', (table) => {
      table
      .increments('id')
      .unsigned()
      .notNullable()
      .primary();

      table.integer('forecast_id')
      .unsigned()
      .references('id')
      .inTable('forecasts')
      .notNullable()
      .onDelete('CASCADE')

      table.integer('program_id')
      .unsigned()
      .references('id')
      .inTable('programs')
      .notNullable()
      .onDelete('CASCADE')
    })
  }

  down () {
    this.drop('forecast_program_relations')
  }
}

module.exports = ForecastProgramRelationsSchema
