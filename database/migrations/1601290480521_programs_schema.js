'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProgramsSchema extends Schema {
  up () {
    this.create('programs', (table) => {
      table.increments()
      table.integer('trainer_id')
      table.integer('user_id')
      table.integer('status')
      table.string('goal_direction')
      table.date('start_date')
      table.integer('term')
      table.json('food_data')
      table.json('suppliments_data')
      table.json('workout_data')
      table.json('water_data')
      table.integer('number_phases')
      table.timestamps()
    })
  }

  down () {
    this.drop('programs')
  }
}

module.exports = ProgramsSchema
