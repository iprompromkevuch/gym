'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database');
/** 
*  @swagger
*  definitions:
*    Gym:
*      type: object
*      properties:
*        id:
*          type: uint
*        name:
*          type: string
*        description:
*          type: string
*        phone:
*          type: string
*        email:
*          type: email
*        city:
*          type: string
*        state:
*          type: string
*        address_line1:
*          type: text
*        address_line2:
*          type: text
*        zip:
*          type: string
*        work_hours:
*          type: json
*        payment_details:
*          type: json
*        company_id:
*          type: integer
*        status:
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

class Gym extends Model {
    
    static get hidden () {
        return ['payment_details'];
      }
    company() {
        return this.hasOne('App/Models/Company', 'company_id', 'id');
    }
    
    setProperty(property, value) {
        if(value !== undefined && value !== null) {
            if(property === 'company_id' || property === 'work_hours' || property === 'payment_details') {
                return false;
            }
            else {
                this[property] = value;
            }
        }
    }
    
    async setCompany(new_id, user_id) {
        const roles = [3];
        let company = await this.company().first();
        if(company.id !== new_id) {
            let n = await Database
                .from('user_role_relations')
                .where('user_role_relations.user_id', '=', user_id)
                .where('user_role_relations.company_id', '=', new_id)
                .whereIn('role_id', roles)
            .count();
            if(parseInt(n[0].count) > 0) {
                this.company_id = new_id;
            }
        }
        else {
            this.company_id = new_id;
        }
    }
    
    static async allowedCreate(user_id, company_id) {
         const roles = [3];
         let n = await Database
                .from('user_role_relations')
                .where('user_role_relations.user_id', '=', user_id)
                .where('user_role_relations.company_id', '=', company_id)
                .whereIn('role_id', roles)
                .count();
        if(parseInt(n[0].count) > 0) {return true;}
        else {return false;}
    }
    
    async allowedEdit(user_id) {
        const roles = [3];
        let company = await this.company().first();
        if(company.owner_id == user_id) {
            return true;
        }
        let n = await Database
            .from('user_role_relations')
            .where('user_role_relations.user_id', '=', user_id)
            .where('user_role_relations.company_id', '=', company.id)
            .whereIn('role_id', roles)
            .count();
            if(parseInt(n[0].count) > 0) {return true;}
            else {return false;}
    } 
}

module.exports = Gym
