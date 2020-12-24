'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ForecastsSchema extends Schema {
  up () {
    this.table('forecasts', (table) => {
      table.renameColumn('owner_id', 'created_by')
      table.integer('company_id')
    })
  }

  down () {
    this.table('forecasts', (table) => {
      table.renameColumn('created_by','owner_id')
      table.dropColumn('company_id')
    })
  }
}

module.exports = ForecastsSchema
