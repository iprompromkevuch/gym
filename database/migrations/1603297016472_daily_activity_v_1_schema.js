'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DailyActivityV1Schema extends Schema {
  up () {
    this.create('daily_activity_v1', (table) => {
      table.increments()
      table.string('gender')
      table.float('multiplier')
      table.string('activity_level')
    })
  }

  down () {
    this.drop('daily_activity_v1')
  }
}

module.exports = DailyActivityV1Schema
