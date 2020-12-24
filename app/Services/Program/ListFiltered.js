'use strict'

const Program    = use("App/Models/Program");
const User       = require("../../Models/User");
const dumps      = use('App/Utils/dumps');
const pagination = use('App/Utils/pagination');

class ListFiltered {
    async execute(request, auth, response) {
        try {
            const input = request.all();
            const userId = auth.user.id;
            const limit = +input.limit;
            const page  = +input.page - 1;
            const goal_filter          = input.goal_filter || '';
            const gender_filter        = input.gender_filter || '';
            const fitness_level_filter = input.fitness_level_filter || '';

            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }
            const programs = await Program.getFiltered(limit, page, goal_filter, gender_filter, fitness_level_filter, user);

            return response.status(200).json({
                data : programs.data
                ? programs.data.map((item) => dumps.dumpProgram(item))
                : programs.map((item) => dumps.dumpProgram(item)),
                pagination : pagination(programs, limit, page)
            });
        } catch (err) {
            console.log(err)
            return response.status(500).json({ error : err })
        }
    }
}

/**
  * @swagger
  * /api/v1/program/search/filter:
  *   get:
  *     tags:
  *       - Program API
  *     security:
  *       - bearerAuth: []
  *     summary: show filtered programs
  *     parameters:
  *       - name        : limit
  *         description : how many programs you need to see
  *         in          : query
  *         required    : true
  *         type        : integer
  *       - name        : page
  *         description : how many items you want to skip (limit * page) from 1
  *         in          : query
  *         required    : true
  *         type        : integer
  *       - name        : goal_filter
  *         description : filter programs by goal name ('Weight Loss' 'Re-costruction' 'Maintaince' 'Weight gain' 'Contest')
  *         in          : query
  *         type        : string
  *       - name        : gender_filter
  *         description : filter programs by gender (one of male, female)
  *         in          : query
  *         type        : string
  *       - name        : fitness_level_filter
  *         description : filter programs by fitness level (one of beginner, semi-moderate, intermediate, heavy, pro)
  *         in          : query
  *         type        : string
  * 
  *     responses:
  *       200:
  *         description: success
  *         example: {
                "data": [
                    {
                    "id": 16,
                    "trainer_id": 2,
                    "gender": "male",
                    "status": 2,
                    "goal_direction": "Weight Loss",
                    "fitness_level": "beginner",
                    "count_of_weeks": 32,
                    "lean_mass_goal": 100,
                    "weight_loss_goal": 100,
                    "workout_sessions_per_week": 3,
                    "start_date": "2000-10-19T21:00:00.000Z",
                    "term": 1,
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
                ],
                "pagination": {
                    "total": 6,
                    "perPage": 1,
                    "page": 3,
                    "lastPage": 7
                }
            }
  *       400:
  *         description: Not found
  *         example:
  *           response: {
                "error": {
                    "message": "Workout doesnt exist"
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

module.exports = ListFiltered;