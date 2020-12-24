'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PermissionsForecastsSchema extends Schema {
  up () {
    this.table('permissions_forecasts', (table) => {
      this.dropIfExists('permissions_forecasts')
      this.dropIfExists('permissions_programs')
    })
  }

  down () {
    this.table('permissions_forecasts', (table) => {
      // reverse alternations
    })
  }
}

module.exports = PermissionsForecastsSchema
