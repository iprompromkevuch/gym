'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WorkoutsPerWeekSchema extends Schema {
  up () {
    this.create('workouts_per_week', (table) => {
      table.increments();
      table.integer('phase');
      table.integer('number');
      table.string('program');
    })
  }

  down () {
    this.drop('workouts_per_week')
  }
}

module.exports = WorkoutsPerWeekSchema
