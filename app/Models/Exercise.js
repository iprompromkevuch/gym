'use strict'
const Database = use('Database');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model  = use('Model');
const Muscle = use('App/Models/Muscle');


/** 
*  @swagger
*  definitions:
*    Exercise:
*      type: object
*      properties:
*        id:
*          type: uint
*        primary_muscle_id:
*          type: uint
*        ability_level:
*          type    : array
*          items   :
*             type : string
*        type:
*          type: int
*        name:
*          type: string
*        description:
*          type: string
*        created_by:
*          type: uint
*        role_id:
*          type: uint
*        company_id:
*          type: uint
*        is_system_default:
*          type: boolean
*        
*      required:
*        - primary_muscle_id
*        - ability_level
*        - type
*        - name
*        - description
*        - created_by
*        - role_id
*        - company_id
*/


class Exercise extends Model {
    static get table () {
        return 'exercises';
    }

    async getMuscleName() {
        const muscle = await Muscle.find(this.primary_muscle_id);
        return muscle.primary_muscle;
    }

    async getAbilityLevels() {
        const exerciseAbilities = await Database.table('exercise_ability_relations')
            .where('exercise_id', this.id);
        const abilityIds = exerciseAbilities.map((item) => item.ability_id);

        const abilities = abilityIds.length === 0 
        ? [] 
        : await Database.table('abilities')
            .whereRaw('id in (?)', ...abilityIds);

        return abilities.map((item) => {
            return item.ability_level;
        })
    }

    async checkIfExerciseAssigned() {
        const isAssigned = await Database.table('exercise_workout_relations')
            .where('exercise_id', this.id).count();
        
        if (isAssigned[0].count > 0) return true;
        return false;
    }

    static checkAbilityLevelUnique(array) {
        let countOfEachAbility = {1 : 0, 2 : 0, 3 : 0};
        array.forEach((item) => countOfEachAbility[item]++);

        for (let count of Object.entries(countOfEachAbility)) {
            if (count[1] > 1) { 
                return false;
            }
        }

        return true;
    }

    static async getFullDataAboutOneExercise(id, userId) {
        // array_to_string(array_agg(distinct "ability_level"),', ') AS ability_level,
        const data = await Database.raw(`
                Select exercises.id,
                array_agg(distinct "ability_id") AS ability_level,
                array_agg(distinct "ability_level") AS ability_level_names,
                favorite_exercises.exercise_id as favorite,
                muscles.id as primary_muscle_id, 
                muscles.primary_muscle as primary_muscle, 
                exercises.created_by,
                exercises.company_id,
                exercises.type,
                exercises.name,
                exercises.description,
                exercises.is_system_default,
                count(*) OVER() AS count from exercises
                left Join muscles on exercises.primary_muscle_id = muscles.id
                left Join favorite_exercises on favorite_exercises.exercise_id = exercises.id
                and favorite_exercises.user_id = ${userId}
                left Join exercise_ability_relations on 
                   exercises.id = exercise_ability_relations.exercise_id
                left Join abilities on ability_id = abilities.id
                where exercises.id = ${id}
                GROUP BY 1, 4, 5, 6, 7, 8, 9, 10, 11
            `);

        return data.rows[0];
    }

    static async getFullDataAboutExercise(limit, page, companiesIds, userId) {
        const data = await Database.raw(`
                Select exercises.id,
                array_agg(distinct "ability_id") AS ability_level,
			    array_agg(distinct "ability_level") AS ability_level_names,
                favorite_exercises.exercise_id as favorite,
                muscles.id as primary_muscle_id, 
                muscles.primary_muscle as primary_muscle, 
                exercises.created_by,
                exercises.company_id,
                exercises.type,
                exercises.name,
                exercises.description,
                exercises.is_system_default,
                count(*) OVER() AS count from exercises
                left Join muscles on exercises.primary_muscle_id = muscles.id
                left Join favorite_exercises on favorite_exercises.exercise_id = exercises.id
                and favorite_exercises.user_id = ${userId}
                left Join exercise_ability_relations on 
                   exercises.id = exercise_ability_relations.exercise_id
                left Join abilities on ability_id = abilities.id
                where (is_system_default = true OR company_id in(${companiesIds}))
                GROUP BY 1, 4, 5, 6, 7, 8, 9, 10, 11
                limit ${limit} offset ${limit * page}
            `);

        return data.rows;
    }

    static async getAvailable(user, limit, page) {
        /*
            1. if admin -> all
            2. if other -> find company
            3. get exercises of company 
        */
       // admin sees everything
        const isAdmin = await user.isAdmin();
        if (isAdmin) {
            const data = await Database.raw(`
                Select exercises.id, 
                array_agg(distinct "ability_id") AS ability_level,
			    array_agg(distinct "ability_level") AS ability_level_names,
                favorite_exercises.exercise_id as favorite,
                muscles.id as primary_muscle_id, 
                muscles.primary_muscle as primary_muscle, 
                exercises.created_by,
                exercises.company_id,
                exercises.type,
                exercises.name,
                exercises.description,
                exercises.is_system_default,
                count(*) OVER() AS count from exercises
                left Join muscles on exercises.primary_muscle_id = muscles.id
                left Join favorite_exercises on favorite_exercises.exercise_id = exercises.id
                and favorite_exercises.user_id = ${user.id}
                left Join exercise_ability_relations on 
                exercises.id = exercise_ability_relations.exercise_id
                left Join abilities on ability_id = abilities.id
                GROUP BY 1, 4, 5, 6, 7, 8, 9, 10, 11
                limit ${limit} offset ${limit * page}
            `);
            return data.rows;
        }

        const userCompanies = await Database.table('user_role_relations')
            .where('user_id', user.id);
        const userCompaniesIds = userCompanies.map((item) => item.company_id);
        const companyExercises = await this.getFullDataAboutExercise(limit, page, userCompaniesIds, user.id);

        return companyExercises;
    }


    static async getFullDataAboutExerciseWithRestrictions(limit, page, companiesIds,
        filterString, sort, isFavorite, userId) {
        let data = [];
        if (!isFavorite) {
            data = await Database.raw(`
                Select 
                exercises.id, 
                array_agg(distinct "ability_id") AS ability_level,
                array_agg(distinct "ability_level") AS ability_level_names,
                favorite_exercises.exercise_id as favorite,
                muscles.id as primary_muscle_id, 
                muscles.primary_muscle as primary_muscle, 
                exercises.created_by,
                exercises.company_id,
                exercises.type,
                exercises.name,
                exercises.description,
                exercises.is_system_default,
                count(*) OVER() AS count from exercises
                left Join muscles on exercises.primary_muscle_id = muscles.id
                left Join favorite_exercises on favorite_exercises.exercise_id = exercises.id
                and favorite_exercises.user_id = ${userId}
                left Join exercise_ability_relations on 
                   exercises.id = exercise_ability_relations.exercise_id
                left Join abilities on ability_id = abilities.id
                where (is_system_default = true OR company_id in(${companiesIds}))
                    ${filterString ? 'AND ' + filterString : ''}
                GROUP BY 1, 4, 5, 6, 7, 8, 9, 10, 11
                order by ${sort.field} ${sort.order}
                limit ${limit} offset ${limit * page}
            `);
        } else {
            data = await Database.raw(`
                Select exercises.id, 
                array_agg(distinct "ability_id") AS ability_level,
                array_agg(distinct "ability_level") AS ability_level_names,
                favorite_exercises.exercise_id AS favorite,
                muscles.id as primary_muscle_id, 
                muscles.primary_muscle as primary_muscle, 
                exercises.created_by, 
                exercises.company_id,
                exercises.type,
                exercises.name,
                exercises.description,
                exercises.is_system_default,
                count(*) OVER() AS count from exercises
                left Join muscles on exercises.primary_muscle_id = muscles.id
                left Join favorite_exercises on favorite_exercises.exercise_id = exercises.id
                and favorite_exercises.user_id = ${userId}
                left Join exercise_ability_relations on 
                   exercises.id = exercise_ability_relations.exercise_id
                left Join abilities on ability_id = abilities.id
                where (favorite_exercises.exercise_id IS NOT NULL AND
                    (is_system_default = true OR company_id in(${companiesIds})))
                    ${filterString ? 'AND ' + filterString : ''}
                GROUP BY 1, 4, 5, 6, 7, 8, 9, 10, 11
                order by ${sort.field} ${sort.order}
                limit ${limit} offset ${limit * page}
            `);
        }

        return data.rows;
    }

    static async getAvailableWithRestrictions(user, limit, page, 
        filterString = '', sort = {field: 'ability_level', order: 'ASC'}, isFavorite) {
        /*
            1. if admin -> all
            2. if other -> find company
            3. get exercises of company 
        */
       // admin sees everything
        const isAdmin = await user.isAdmin();
        if (isAdmin) {
            const data = await Database.raw(`
                Select exercises.id, 
                array_agg(distinct "ability_id") AS ability_level,
                array_agg(distinct "ability_level") AS ability_level_names,
                favorite_exercises.exercise_id AS favorite,
                muscles.id as primary_muscle_id, 
                muscles.primary_muscle as primary_muscle, 
                exercises.created_by, 
                exercises.company_id,
                exercises.type,
                exercises.name,
                exercises.description,
                exercises.is_system_default,
                count(*) OVER() AS count from exercises
                left Join muscles on exercises.primary_muscle_id = muscles.id
                left Join favorite_exercises on favorite_exercises.exercise_id = exercises.id
                and favorite_exercises.user_id = ${userId}
                left Join exercise_ability_relations on 
                   exercises.id = exercise_ability_relations.exercise_id
                left Join abilities on ability_id = abilities.id
                ${filterString ? 'where ' + filterString : ''}
                GROUP BY 1, 4, 5, 6, 7, 8, 9, 10, 11
                order by ${sort.field} ${sort.order}
                limit ${limit} offset ${limit * page}`);
            return data.rows;
        }

        const userCompanies = await Database.table('user_role_relations')
            .where('user_id', user.id);
        const userCompaniesIds = userCompanies.map((item) => item.company_id);
        const companyExercises = await this.getFullDataAboutExerciseWithRestrictions(
            limit, page, userCompaniesIds, filterString, sort, isFavorite, user.id);

        return companyExercises;
    }

    static async findByGroup(groupId, userId) {
        const data = await Database.raw(`
            Select exercises.id, 
            array_agg(distinct "ability_id") AS ability_level,
			array_agg(distinct "ability_level") AS ability_level_names,
            favorite_exercises.exercise_id AS favorite,
            muscles.id as primary_muscle_id, 
            muscles.primary_muscle as primary_muscle, 
            exercises.created_by, 
            exercises.company_id,
            exercises.type, 
            exercises.name,
            exercises.description,
            exercises.is_system_default,
            exercise_groups_items.order,
			exercise_groups_items.id as exercise_groups_items_id,
            count(*) OVER() AS count from exercise_groups_items
            left Join exercises on 
                exercises.id = exercise_groups_items.exercise_id
            left Join muscles on exercises.primary_muscle_id = muscles.id
            left Join favorite_exercises on favorite_exercises.exercise_id = exercises.id
            and favorite_exercises.user_id = ${userId}
            left Join exercise_ability_relations on 
                exercises.id = exercise_ability_relations.exercise_id
            left Join abilities on ability_id = abilities.id
            where exercise_groups_items.group_id = ${groupId}
            GROUP BY 1, 4, 5, 13, 14
            order by exercise_groups_items.order ASC`);
        return data.rows;
    }

    static async getFilteredInWorkout(workoutId, limit, page, 
        filterString = '', 
        sort = { field : 'ability_level', order : 'DESC'},
        isFavorite = false, userId, favoriteSort) {
            
        const data = await Database.raw(`
            SELECT exercises.id, 
            array_agg(distinct "ability_id") AS ability_level,
			array_agg(distinct "ability_level") AS ability_level_names,
            muscles.id as primary_muscle_id, 
            muscles.primary_muscle as primary_muscle, 
            exercises.created_by, 
            exercises.created_by,
            exercises.company_id,
            exercises.type,
            exercises.name,
            exercises.description,
            exercises.is_system_default, 
            favorite_exercises.id as favorite,
            count(*) OVER() AS count 
            FROM exercise_workout_relations
            LEFT JOIN exercises on exercise_workout_relations.exercise_id = exercises.id
            LEFT JOIN muscles on exercises.primary_muscle_id = muscles.id
            LEFT JOIN exercise_ability_relations on 
                exercises.id = exercise_ability_relations.exercise_id
            LEFT JOIN abilities on exercise_ability_relations.ability_id = abilities.id
            LEFT JOIN favorite_exercises 
            on favorite_exercises.exercise_id = exercises.id
            and favorite_exercises.user_id = ${userId}
            WHERE exercise_workout_relations.workout_id = ${workoutId}
            ${isFavorite ? ' AND favorite_exercises.user_id = ' + userId : ''}
            ${filterString ? ' AND ' + filterString : ''}
            GROUP BY 1, 4, 5, 6, 7, 8, 9, 10, 13
            ORDER BY ${favoriteSort ? 'favorite' : sort.field} ${sort.order}
            LIMIT ${limit} OFFSET ${limit * page}
        `);

        return data.rows ? data.rows : [];
    }
}

module.exports = Exercise;