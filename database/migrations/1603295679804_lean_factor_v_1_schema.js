'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LeanFactorV1Schema extends Schema {
  up () {
    this.create('lean_factor_v1', (table) => {
      table.increments()
      table.string('gender')
      table.float('lean_factor')
      table.float('body_fat_from')
      table.float('body_fat_to')
      table.float('multiplier')
    })
  }

  down () {
    this.drop('lean_factor_v1')
  }
}

module.exports = LeanFactorV1Schema;
