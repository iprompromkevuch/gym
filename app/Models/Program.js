'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

/** 
*  @swagger
*  definitions:
*    Program:
*      type: object
*      properties:
*        id:
*           type: uint
*        trainer_id:
*           type: uint
*        user_id:
*           type: uint
*        created_by:
*           type: uint
*        company_id:
*           type: uint
*        status:
*           type: integer
*        goal_direction:
*           type: string
*        start_date:
*           type: date
*        term:
*           type: integer
*        food_data:
*           type: json
*        suppliments_data:
*           type: json
*        workout_data:
*           type: json
*        water_data:
*           type: json
*        number_phases:
*           type: integer
*        is_system_default:
*           type: boolean
*      required:
*        - user_id
*        - trainer_id
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

const Database = use('Database');

class Program extends Model {
    static get table() {
        return 'programs';
    }

    static async findAvailable(user, limit, page) {
        const isAdmin = await user.isAdmin();
        if (isAdmin) {
            const data = await Database.raw(`
                Select *, count(*) OVER() AS count From public.programs
                limit ${limit} offset ${limit * page}
            `);
            return data.rows;
        }

        /* 1. find all user's roles and companies
           2. find system default
           3. if role_id in range (1,2,3,4,5) =>
                select programs by company_id (created by their staff or themselves)
           4. paginate
        */
        const result = await Database.raw(`
            WITH user_relations as(
                Select * From public.user_role_relations
                where user_id = ${user.id}
            )
            Select *, count(*) OVER() AS count From public.programs
            Where is_system_default = true OR company_id in 
                (Select company_id from user_relations where role_id in (1,2,3,4,5))
            limit ${limit} offset ${limit * page}
        `);

        return result.rows;
    }

    static async getFiltered(limit, page, goal_filter, gender_filter, fitness_level_filter, user) {        
        const result = await Database.raw(`
            WITH user_relations as(
                Select * From public.user_role_relations
                where user_id = ${user.id}
            )
            Select *, count(*) OVER() AS count From public.programs
            Where (is_system_default = true OR company_id in 
            (Select company_id from user_relations where role_id in (1,2,3,4,5)))
            ${goal_filter ? "AND programs.goal_direction = '" + goal_filter + "'" : ''}
            ${gender_filter ? "AND programs.gender = '" + gender_filter + "'" : ''} 
            ${fitness_level_filter ? "AND programs.fitness_level = '" + fitness_level_filter + "'" : ''}
            limit ${limit} offset ${limit * page}
        `);

        return result.rows;
    }

    static async assignToUser(program_id, user_id) {
        const program = await Database.raw(`
            SELECT * FROM programs
            WHERE id = ${program_id}
        `);
        if (!program.rows[0]) {
            return false;
        }

        await Database.raw(`
            INSERT INTO program_user_relations (program_id, user_id)
            VALUES (${program_id}, ${user_id})
        `);

        return true;
    }

    static async deleteAssignmentFromUser(program_id, user_id) {
        await Database.raw(`
            DELETE FROM program_user_relations
            WHERE user_id = ${user_id} AND program_id = ${program_id}
        `)
    }
}

module.exports = Program;
