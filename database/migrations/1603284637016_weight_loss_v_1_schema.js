'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WeightLossV1Schema extends Schema {
  up () {
    this.create('weight_loss_v1', (table) => {
      table.increments()
      table.integer('phase_number')
      table.integer('weight')
      table.float('weight_loss_ratio')
      table.float('increment')
    })
  }

  down () {
    this.drop('weight_loss_v1')
  }
}

module.exports = WeightLossV1Schema
