'use strict'

//const Phase = use('App/Models/Phase');
const User  = use('App/Models/User');
const Database = use('Database')
const dumps = use('App/Utils/dumps');
const Phase = use('App/Models/Phase');

class Create {
    async execute(request, auth, response) {
        try {
            const input = request.all();
            //const userId = auth.user.id;
            const clientId = input.user_id;

            const user = await User.find(clientId);
            if (!user) {
                return response.status(400).json({ message: 'there are no client' });
            }

            // find user phys conditions
            const physConditions = await Database.raw(`
                SELECT * FROM physical_conditions
                WHERE user_id = ${clientId}
                ORDER BY created_at DESC
                limit 1 
            `);

            // find user program
            const userProgram = await Database.raw(`
                SELECT * FROM program_user_relations
                LEFT JOIN programs on programs.id = program_user_relations.program_id
                WHERE user_id = ${clientId}
            `);

            if (!physConditions.rows[0]) {
                return response.status(400).json({ message: 'physical conditions for this user were not specified' });
            }

            const data = {
                current_weight     : physConditions.rows[0].weight, // user phys cond
                body_fat_p         : physConditions.rows[0].total_body_fat_p, // user phys cond
                gender             : user.sex, // user profile
                weight_loss_goal   : userProgram.rows[0] ? userProgram.rows[0].weight_loss_goal : false, // user program
                lean_mass_goal     : userProgram.rows[0] ? userProgram.rows[0].lean_mass_goal : false, // user program
                weeksCount         : userProgram.rows[0] ? userProgram.rows[0].count_of_weeks : false, // user program
                goal_direction     : userProgram.rows[0] ? userProgram.rows[0].goal_direction : false, // user program
                activity_level     : input.activity_level // input
            }

            const result = await Phase.calculatePhasesData(data) || {};

            return response.status(201).json({
                data     : result.data.length ? result.data.map(item => dumps.dumpPhase(item)) : {},
                versions : result.versions,
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}


  /**
  * @swagger
  * /api/v1/phase:
  *   post:
  *     tags:
  *       - Phase API
  *     security:
  *       - bearerAuth: []
  *     summary: test variant. Weight from auth user phys conditions, body fat % from auth user phys conditions, gender from auth user gender
  *     parameters:
  *       - name        : activity_level
  *         description : user activity level. But I think, it is better to put this field to database like in program or physical conditions. One of beginner,intermediate,semi moderate,pro,heavy
  *         in          : query
  *         required    : true
  *         type        : string
  *       - name        : user_id
  *         description : client_id
  *         in          : query
  *         required    : true
  *         type        : integer
  * 
  *     responses:
  *         201:
*               description: Info phase loses. Compare it with data in table calculations
*               example: {
                    "data": [
                        {
                        "phase_number": 1,
                        "phase_starting_weight": 230,
                        "phase_weight": 157.16666658999998,
                        "lost_weight_during_phase": 72.83333341000001,
                        "weight_loss_percent": 31.6666667,
                        "calories": 1465.9363629212723,
                        "activity_level": "beginner",
                        "cardio_mins_per_week": 225,
                        "workout_suggestions": {
                            "program": "Weight Loss",
                            "number_of_workouts": {
                            "morning": 6,
                            "evening": 0,
                            "total": 6,
                            "cardio_mins_per_session": 38
                            }
                        }
                        },
                        {
                        "phase_number": 2,
                        "phase_starting_weight": 157.16666658999998,
                        "phase_weight": 140.2072877405985,
                        "lost_weight_during_phase": 16.959378849401475,
                        "weight_loss_percent": 10.790697046240304,
                        "calories": 1307.7516111077641,
                        "activity_level": "beginner",
                        "cardio_mins_per_week": 356.25,
                        "workout_suggestions": {
                            "program": "Weight Loss",
                            "number_of_workouts": {
                            "morning": 6,
                            "evening": 4,
                            "total": 10,
                            "cardio_mins_per_session": 36
                            }
                        }
                        },
                        {
                        "phase_number": 3,
                        "phase_starting_weight": 140.2072877405985,
                        "phase_weight": 115.61892420930067,
                        "lost_weight_during_phase": 24.588363531297833,
                        "weight_loss_percent": 17.537150833977663,
                        "calories": 1089.7609147291175,
                        "activity_level": "intermediate",
                        "cardio_mins_per_week": 600,
                        "workout_suggestions": {
                            "program": "Weight Loss",
                            "number_of_workouts": {
                            "morning": 6,
                            "evening": 4,
                            "total": 10,
                            "cardio_mins_per_session": 60
                            }
                        }
                        },
                        {
                        "phase_number": 4,
                        "phase_starting_weight": 115.61892420930067,
                        "phase_weight": 116.995411316208,
                        "lost_weight_during_phase": -1.376487106907331,
                        "weight_loss_percent": -1.1905378953496637,
                        "calories": 1102.7349313876769,
                        "activity_level": "intermediate",
                        "cardio_mins_per_week": 600,
                        "workout_suggestions": {
                            "program": "Weight Loss",
                            "number_of_workouts": {
                            "morning": 6,
                            "evening": 6,
                            "total": 12,
                            "cardio_mins_per_session": 50
                            }
                        }
                        }
                    ],
                    "versions": {
                        "weight_loss_ratio_table_version": 1,
                        "lean_factor_table_version": 1,
                        "daily_activity_table_version": 1
                    }
                    }
  *         400:
*               description: Physical condition already exists
*               example:
*                   response: {
                                "message": "physical conditions for this user were not specified"
                            }
  *         401:
  *           description: Not authorized
  *           example:
  *             response: {
                    "error": {
                        "message": "E_INVALID_JWT_TOKEN: jwt must be provided",
                        "name": "InvalidJwtToken",
                    }
                }
  *         422:
  *           description: validation
  *           example: 
  *             "errors": [
                    {
                        "title": "in",
                        "detail": "in validation failed on filters.0.field",
                        "source": {
                            "pointer": "filters.0.field"
                        }
                    }
                ]
            

    */
   
module.exports = Create;