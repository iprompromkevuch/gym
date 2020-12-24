'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments();
      table.string('email', 150).notNullable().unique();
      table.string('password', 255).notNullable();
      table.string('first_name', 120);
      table.string('last_name', 180);
      table.string('state', 50);
      table.string('city', 255);
      table.text('address_line1');
      table.text('address_line2');
      table.string('phone', 30);
      table.string('sex', 254);
      table.date('birthdate');
      table.text('profile_img_url');
      table.text('bio');
      table.text('additional_info');
      table.timestamps();
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
