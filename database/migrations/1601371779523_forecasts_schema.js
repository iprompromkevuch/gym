'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ForecastsSchema extends Schema {
  up () {
    this.create('forecasts', (table) => {
      table.increments()
      table.integer('owner_id')
      table.string('name')
      table.string('gender')
      table.string('goal_direction')
      table.string('fitness_level')
      table.string('term')
      table.string('style')
      table.string('rest')
      table.string('sequence')
      table.timestamps()
    })
  }

  down () {
    this.drop('forecasts')
  }
}

module.exports = ForecastsSchema
