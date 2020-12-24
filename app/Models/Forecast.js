'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const Database = use("Database");
/** 
*  @swagger
*  definitions:
*    Forecast:
*      type: object
*      properties:
*        id:
*           type: uint
*        created_by:
*           type: uint
*        company_id:
*           type: uint
*        name:
*           type: string
*        gender:
*           type: string
*        goal_direction:
*           type: string
*        fitness_level:
*           type: string
*        term:
*           type: string
*        style:
*           type: string
*        rest:
*           type: string
*        sequence:
*           type: string
*        is_system_default:
*           type: boolean
*      required:
*        - created_by
*        - company_id
*        - name
*        - gender
*        - goal_direction
*        - fitness_level
*        - term
*        - style
*        - rest
*        - sequence
*        - is_system_default
*/

class Forecast extends Model {
    static get table() {
        return 'forecasts';
    }

    async isAssignedToProgram() {
        const count = await Database.table('forecast_program_relations')
            .where('forecast_id', this.id)
            .count();
        
        return count[0].count;   
    }

    static async findAvailable(user, limit, page) {
        // admin sees everything
        const isAdmin = await user.isAdmin();
        if (isAdmin) {
            const data = await Database.raw(`
                Select *, count(*) OVER() AS count From public.forecasts
                limit ${limit} offset ${limit * page}
            `);
            return data.rows;
        }

        /* 1. find all user's roles and companies
           2. find system default
           3. if role_id in range (1,2,3,4,5) =>
                select forcasts by company_id (created by their staff or themselves)
           4. paginate
        */
        const result = await Database.raw(`
                WITH user_relations as(
                    Select * From public.user_role_relations
                    where user_id = ${user.id}
                )
                Select *, count(*) OVER() AS count From public.forecasts
                Where is_system_default = true OR company_id in 
                    (Select company_id from user_relations where role_id in (1,2,3,4,5))
                limit ${limit} offset ${limit * page}    
        `);

        return result.rows;
    }
}

module.exports = Forecast;
