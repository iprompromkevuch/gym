'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PhysicalConditionsSchema extends Schema {
  up () {
    this.table('physical_conditions', (table) => {
      table.renameColumn('tigh', 'thigh')
      table.renameColumn('tights_l', 'thigh_l')
      table.renameColumn('tights_r', 'thigh_r')
    })
  }

  down () {
    this.table('physical_conditions', (table) => {
      table.renameColumn('thigh','tigh')
      table.renameColumn('thigh_l','tights_l')
      table.renameColumn('thigh_r','tights_r')
    })
  }
}

module.exports = PhysicalConditionsSchema
