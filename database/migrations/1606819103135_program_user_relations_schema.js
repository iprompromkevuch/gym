'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProgramUserRelationsSchema extends Schema {
  up () {
    this.create('program_user_relations', (table) => {
      table.increments();
      table.integer('user_id');
      table.integer('program_id');
    })
  }

  down () {
    this.drop('program_user_relations')
  }
}

module.exports = ProgramUserRelationsSchema
