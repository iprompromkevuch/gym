'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WeightLossV1Schema extends Schema {
  up () {
    this.table('weight_loss_v1', (table) => {
      table.string('gender');
    })
  }

  down () {
    this.table('weight_loss_v1', (table) => {
      table.dropColumn('gender')
    })
  }
}

module.exports = WeightLossV1Schema
