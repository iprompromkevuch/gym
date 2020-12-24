'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProgramUserRelationsSchema extends Schema {
  up () {
    this.drop('program_user_relations')
  }

  down () {
    this.create('program_user_relations', (table) => {
      table.increments();
      table.integer('user_id');
      table.integer('program_id');
    })
  }
}

module.exports = ProgramUserRelationsSchema
