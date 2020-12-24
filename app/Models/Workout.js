'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const Database = use('Database');
/** 
*  @swagger
*  definitions:
*    Workout:
*      type: object
*      properties:     
*        created_by:
*           type: int
*        is_system_defaut:
*           type: bool
*        company_id:
*           type: int
*        name:
*           type: string
*        description:
*           type: string
*        type:
*           type: string
*      required:
*        - created_by
*        - is_system_defaut
*        - company_id
*        - name
*        - description
*        - type
*/

class Workout extends Model {
    static get table () {
        return 'workouts';
    }

    static async findWithFavorite(workoutId, userId) {
        const data = await Database.raw(`
            select workouts.id, 
            array_agg(distinct "ability_id") AS ability_level,
            array_agg(distinct "ability_level") AS ability_level_names,
            workouts.name, 
            workouts.description, 
            workouts.is_system_default,
            workouts.type, 
            workouts.company_id, 
            workouts.created_by,
            favorite_workouts.workout_id as favorite, count(*) OVER() AS count From workouts
            left join favorite_workouts on workouts.id = favorite_workouts.workout_id and favorite_workouts.user_id = ${userId}
            left join workout_ability_relations on workouts.id = workout_ability_relations.workout_id
            left join abilities on workout_ability_relations.ability_id = abilities.id
            where workouts.id = ${workoutId}
            group by 1, 10
            limit 1
        `);

        return data.rows ? data.rows[0] : null
    }

    static async getAvailable(user, limit, page) {
        /*
            1. if admin -> all
            2. if other -> find company
            3. get workouts of company 
        */
       // admin sees everything
        const isAdmin = await user.isAdmin();
        if (isAdmin) {
            const data = await Database.raw(`
            select workouts.id, 
            array_agg(distinct "ability_id") AS ability_level,
            array_agg(distinct "ability_level") AS ability_level_names,
            workouts.name, 
            workouts.description, 
            workouts.is_system_default,
            workouts.type, 
            workouts.company_id, 
            workouts.created_by,
            favorite_workouts.workout_id as favorite, count(*) OVER() AS count 
            From workouts
            left join favorite_workouts on workouts.id = favorite_workouts.workout_id
            and favorite_workouts.user_id = ${user.id}
            left join workout_ability_relations on workouts.id = workout_ability_relations.workout_id
            left join abilities on workout_ability_relations.ability_id = abilities.id
            group by 1, 10
            limit ${limit} offset ${limit * page}
            `);
            return data.rows;
        }

        const userCompanies = await Database.table('user_role_relations')
            .where('user_id', user.id);
        if (!userCompanies || userCompanies.length === 0) return []

        const userCompaniesIds = userCompanies.map((item) => item.company_id);
        const companyWorkouts = await this.getWorkoutsViaCompanies(limit, page, userCompaniesIds, user.id);
        return companyWorkouts;
    }

    static async getWorkoutsViaCompanies(limit, page, userCompaniesIds, userId) {
        console.log(limit, page, userCompaniesIds)
        const data = await Database.raw(`
            select workouts.id, 
            array_agg(distinct "ability_id") AS ability_level,
            array_agg(distinct "ability_level") AS ability_level_names,
            workouts.name, 
            workouts.description, 
            workouts.is_system_default,
            workouts.type, 
            workouts.company_id, 
            workouts.created_by,
            favorite_workouts.workout_id as favorite, count(*) OVER() AS count From workouts
            left join favorite_workouts on workouts.id = favorite_workouts.workout_id and favorite_workouts.user_id = ${userId}
            left join workout_ability_relations on workouts.id = workout_ability_relations.workout_id
            left join abilities on workout_ability_relations.ability_id = abilities.id
            where is_system_default = true OR company_id in (${userCompaniesIds})
            group by 1, 10
            limit ${limit} offset ${limit * page}
        `);
        return data.rows;
    }

    static async getExercises(workoutId, userId) {
        const data = await Database.raw(`
            Select exercises.id,
            array_agg(distinct "ability_id") AS ability_level,
			array_agg(distinct "ability_level") AS ability_level_names,
            favorite_exercises.exercise_id as favorite,
            muscles.id as primary_muscle_id, 
            muscles.primary_muscle as primary_muscle, 
            exercises.type,
            exercises.description,
            exercises.created_by,
            exercises.company_id,
            exercises.is_system_default from workouts
            left join exercise_workout_relations 
                on exercise_workout_relations.workout_id = workouts.id
            left join exercises
                on exercises.id = exercise_workout_relations.exercise_id
            left join muscles
                on muscles.id = exercises.primary_muscle_id
            left Join favorite_exercises on favorite_exercises.exercise_id = exercises.id and favorite_exercises.user_id = ${userId}
            left Join exercise_ability_relations on 
                exercises.id = exercise_ability_relations.exercise_id
            left Join abilities on ability_id = abilities.id
            Where workouts.id = ${workoutId}
            GROUP BY 1, 4, 5, 6, 7, 8, 9, 10, 11
        `);

        const result = data.rows.filter((item) => item.id);
        return result;
    }

    async isAssignedToProgram() {
        const data = await Database.raw(`
            select count(*) from workout_program_relations
            where workout_id = ${this.id}
        `)

        return data.rows[0].count !== '0' ? true : false;
    }

    static async getWorkoutGroups(workoutId) {
        const data = await Database.raw(`
            Select * from exercise_groups
            where workout_id = ${workoutId} 
            order by exercise_groups.order ASC
        `);

        return data.rows[0] ? data.rows : false;
    }

    static async getFullDataAboutOneWorkout(workoutId, userId) {
        const data = await Database.raw(`
            Select workouts.id,
            array_agg(distinct "ability_id") AS ability_level,
            array_agg(distinct "ability_level") AS ability_level_names,
            favorite_workouts.workout_id as favorite,
            workouts.company_id,
            workouts.name,
            workouts.description,
            workouts.type,
            workouts.is_system_default
            from workouts
            left join favorite_workouts on favorite_workouts.workout_id = workouts.id
            and favorite_workouts.user_id = ${userId}
            left join workout_ability_relations on workouts.id = workout_ability_relations.workout_id
            left join abilities on workout_ability_relations.ability_id = abilities.id
            where workouts.id = ${workoutId}
            group by 1, 4
        `);

        return data.rows[0] ? data.rows[0] : {};
    }
}

module.exports = Workout;
