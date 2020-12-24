'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AbilitiesSchema extends Schema {
  up () {
    this.create('abilities', (table) => {
      table.increments()
      table.string('ability_level', 200).notNullable()
    })
  }

  down () {
    this.drop('abilities')
  }
}

module.exports = AbilitiesSchema
