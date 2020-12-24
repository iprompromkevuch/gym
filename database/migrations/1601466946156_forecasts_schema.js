'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ForecastsSchema extends Schema {
  up () {
    this.table('forecasts', (table) => {
      table.boolean('is_system_default')
    })
  }

  down () {
    this.table('forecasts', (table) => {
      table.dropColumn('is_system_default')
    })
  }
}

module.exports = ForecastsSchema
