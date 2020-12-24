'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MusclesSchema extends Schema {
  up () {
    this.create('muscles', (table) => {
      table.increments()
      table.string('primary_muscle', 200)
      table.timestamps()
    })
  }

  down () {
    this.drop('muscles')
  }
}

module.exports = MusclesSchema
