'use strict'

const User     = use('App/Models/User');
const Program  = use('App/Models/Program');
const dumps    = use('App/Utils/dumps');

class Create {
    async execute(request, auth, response) {
        try {
            const input = request.all();
            const userId = auth.user.id;

            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const isCompanyAllowed = await user.checkCompanyPermissions(input.company_id);
            if (!isCompanyAllowed) {
                return response.status(400).json({ message: 'you have no permissions in this company' });
            }

            const isAdmin = await user.isAdmin();
            
            const programData = {
                trainer_id        : +input.trainer_id,
                created_by        : +userId,
                company_id        : +input.company_id,
                status            : +input.status,
                count_of_weeks    : input.count_of_weeks,
                lean_mass_goal    : input.lean_mass_goal,
                weight_loss_goal  : input.weight_loss_goal,
                goal_direction    : input.goal_direction,
                start_date        : input.start_date,
                term              : input.term, 
                food_data         : input.food_data,
                suppliments_data  : input.suppliments_data,
                workout_data      : input.workout_data,
                water_data        : input.water_data,
                fitness_level     : input.fitness_level,
                is_system_default : isAdmin ? true : false,
                gender            : input.gender,
                workout_sessions_per_week: input.workout_sessions_per_week,
            }
            
            const result = await Program.create(programData);

            return response.status(201).json({ 
                "data" : dumps.dumpProgram(result)
            });
        } catch (err) {
            console.log(err, 'err')
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/program:
  *   post:
  *     tags:
  *       - Program API
  *     security:
  *       - bearerAuth: []
  *     summary: Create program
  *     parameters:
  *       - name        : trainer_id
  *         description : trainer
  *         in          : query
  *         required    : true
  *         type        : integer
  *       - name        : gender
  *         description : gender (male or female)
  *         in          : query
  *         required    : true
  *         type        : string
  *       - name        : status
  *         description : status
  *         in          : query
  *         required    : true
  *         type        : integer
  *       - name        : count_of_weeks
  *         description : count_of_weeks in program (one of 16 or 32)
  *         in          : query
  *         required    : true
  *         type        : integer
  *       - name        : lean_mass_goal
  *         description : lean_mass_goal
  *         in          : query
  *         required    : true
  *         type        : integer
  *       - name        : weight_loss_goal
  *         description : weight_loss_goal
  *         in          : query
  *         required    : true
  *         type        : integer
  *       - name        : fitness_level
  *         description : fitness_level one of (beginner, semi-moderate, intermediate, heavy, pro)
  *         in          : query
  *         required    : true
  *         type        : string  
  *       - name        : workout_sessions_per_week
  *         description : workout_sessions_per_week (1-7)
  *         in          : query
  *         required    : true
  *         type        : integer
  *       - name        : goal_direction
  *         description : goal direction (one of 'Weight Loss' 'Re-costruction' 'Maintaince' 'Weight gain' 'Contest')
  *         in          : query
  *         required    : true
  *         type        : string
  *       - name        : start_date
  *         description : start date mm-dd-yyyy format
  *         in          : query
  *         required    : true
  *         type        : string
  *         format      : date
  *       - name        : term
  *         description : term
  *         in          : query
  *         required    : true
  *         type        : integer
  *       - name        : company_id
  *         description : from which company user do it
  *         in          : query
  *         required    : true
  *         type        : integer  
  *       - name        : additional data
  *         description : additional data
  *         in          : body
  *         type        : json
  *         schema      :
  *           type : object
  *           properties :
  *             food_data :
  *               description : some data about food
  *               type : object
  *               properties :
  *                 data :
  *                   type : string
  *             suppliments_data :
  *               description : some data about suppliments
  *               type : object
  *               properties :
  *                 data :
  *                   type : string
  *             workout_data :
  *               description : some data about workout
  *               type : object
  *               properties :
  *                 data :
  *                   type : string
  *             water_data :
  *               description : some data about water
  *               type : object
  *               properties :
  *                 data :
  *                   type : string
  * 
  *     responses:
  *       201:
  *         description: Success
  *         example: {
                "data": {
                    "id": 19,
                    "trainer_id": 2,
                    "status": 2,
                    "goal_direction": "Weight Loss",
                    "count_of_weeks": "16",
                    "lean_mass_goal": "100",
                    "weight_loss_goal": "100",
                    "workout_sessions_per_week": "5",
                    "start_date": "10-20-2000",
                    "term": "2",
                    "food_data": {
                    "data": "string"
                    },
                    "suppliments_data": {
                    "data": "string"
                    },
                    "workout_data": {
                    "data": "string"
                    },
                    "water_data": {
                    "data": "string"
                    },
                    "is_system_default": false
                }
            }
            
  *       401:
  *         description: Not authorized
  *         example:
  *           response: {
                "error": {
                    "message": "E_INVALID_JWT_TOKEN: jwt must be provided",
                    "name": "InvalidJwtToken",
                }
            }
  *       403:
  *         description: You try to reach resources you have no access
  *         example:
  *             response: {
                    "message": "User has no permissions"
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