'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Role extends Model {
   static get table () {
        return 'roles';
   }
   
   users() {
      return this.belongsToMany('App/Models/User', 'role_id', 'user_id', 'id', 'id').pivotTable('user_role_relations')
   }
}

module.exports = Role
