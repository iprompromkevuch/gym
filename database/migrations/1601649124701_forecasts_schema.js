'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ForecastsSchema extends Schema {
  up () {
    this.table('forecasts', (table) => {
      table.index('is_system_default');
      table.index('company_id');
    })
  }

  down () {
    this.table('forecasts', (table) => {
      table.dropIndex('is_system_default');
      table.dropIndex('company_id');
    })
  }
}

module.exports = ForecastsSchema
