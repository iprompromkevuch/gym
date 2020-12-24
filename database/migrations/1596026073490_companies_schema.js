'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CompaniesSchema extends Schema {
  up () {
    this.create('companies', (table) => {
      table.increments();
      table.string('name', 255);
      table.string('state', 50);
      table.string('city', 254);
      table.string('zip', 50);
      table.string('phone', 70);
      table.string('email', 150);
      table.string('contact', 254);
      table.text('address_line1');
      table.text('address_line2');
      table.integer('owner_id');
      table.timestamps();
    })
  }

  down () {
    this.drop('companies')
  }
}

module.exports = CompaniesSchema
