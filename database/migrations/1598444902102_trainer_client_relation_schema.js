'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TrainerClientRelationSchema extends Schema {
  up () {
    this.create('trainer_client_relations', (table) => {
      table.increments();
      table.integer('trainer_id');
      table.integer('client_id');
      table.timestamps();
    })
  }

  down () {
    this.drop('trainer_client_relations')
  }
}

module.exports = TrainerClientRelationSchema
