'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PermissionsForecastSchema extends Schema {
  up () {
    this.create('permissions_forecasts', (table) => {
      table.increments()
      table.integer('forecast_id')
      table.integer('company_id')
      table.integer('role_id')
    })
  }

  down () {
    this.drop('permissions_forecasts')
  }
}

module.exports = PermissionsForecastSchema
