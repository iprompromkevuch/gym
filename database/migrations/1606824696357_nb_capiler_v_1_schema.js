'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NbCapilerV1Schema extends Schema {
  up () {
    this.create('nb_capiler_v1', (table) => {
      table.increments()
      table.integer('weight_from');
      table.integer('weight_to');
      table.integer('nb_capiler');
      table.integer('weeks_count');
    })
  }

  down () {
    this.drop('nb_capiler_v1')
  }
}

module.exports = NbCapilerV1Schema
