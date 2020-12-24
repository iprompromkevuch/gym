'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GymsSchema extends Schema {
  up () {
    this.create('gyms', (table) => {
      table.increments();
      table.string('name', 200);
      table.text('description');
      table.string('phone', 20);
      table.string('email', 150);
      table.string('city', 255);
      table.string('state', 50);
      table.text('address_line1');
      table.text('address_line2');
      table.string('zip', 254);
      table.json('work_hours');
      table.json('payment_details');
      table.integer('company_id');
      table.integer('status');
      table.timestamps();
    })
  }

  down () {
    this.drop('gyms')
  }
}

module.exports = GymsSchema
