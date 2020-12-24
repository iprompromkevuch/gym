'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClientImagesSchema extends Schema {
  up () {
    this.create('client_images', (table) => {
      table.increments();
      table.integer('user_id');
      table.text('url');
      table.timestamps();
    })
  }

  down () {
    this.drop('client_images')
  }
}

module.exports = ClientImagesSchema
