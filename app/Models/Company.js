'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database');
/** 
*  @swagger
*  definitions:
*    Company:
*      type: object
*      properties:
*        id:
*          type: uint
*        name:
*          type: string
*        state:
*          type: string
*        city:
*          type: string
*        zip:
*          type: string
*        phone:
*          type: string
*        email:
*          type: email
*        address_line1:
*          type: text
*        address_line2:
*          type: text
*        owner_id:
*          type: integer
*        status:
*          type: integer
*        contact_id:
*          type: integer
*      required:
*        - name
*        - state
*        - city
*        - zip
*        - phone
*        - email
*        - address_line1
*        - contact_id
*        - status
*        - owner_id
*/

class Company extends Model {
    owner() {
        return this.hasOne('App/Models/User', 'user_id', 'id');
    }
    
    contact() {
        return this.hasOne('App/Models/User', 'contact_id', 'id');
    }

    users() {
        return this.hasMany('App/Models/User', 'user_id', 'id');
    }
    
    async canEdit(user_id) {
        const roles = [3, 4];
        let n = await Database
                .from('user_role_relations')
                .where('user_role_relations.user_id', '=', user_id)
                .where('user_role_relations.company_id', '=', this.id)
                .whereIn('role_id', roles)
                .count();
        if(parseInt(n[0].count) > 0) {return true;}
        else {return false;}
    }
}

module.exports = Company
