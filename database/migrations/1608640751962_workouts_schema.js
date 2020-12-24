'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WorkoutsSchema extends Schema {
  up () {
    this.alter('workouts', (table) => {
      table.integer('type').defaultTo(1).alter();
    })
  }

  down () {
    this.alter('workouts', (table) => {
      table.string('type').defaultTo(1).alter();
    })
  }
}

module.exports = WorkoutsSchema
