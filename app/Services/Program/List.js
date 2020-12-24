'use strict'

const Program    = use('App/Models/Program');
const User       = use('App/Models/User');
const dumps      = use('App/Utils/dumps');
const pagination = use('App/Utils/pagination');

class List {
    async execute(request, auth, response) {
        try {
            const input = request.all();
            const limit = parseInt(input.limit, 10);
            const page  = parseInt(input.page, 10) - 1;
            const userId = auth.user.id;
            
            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const programs = await Program.findAvailable(user, limit, page);

            return response.status(200).json({
                data : programs.data
                    ? programs.data.map((item) => dumps.dumpProgram(item))
                    : programs.map((item) => dumps.dumpProgram(item)),
                pagination : pagination(programs, limit, page) 
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/program:
  *   get:
  *     tags:
  *       - Program API
  *     security:
  *       - bearerAuth: []
  *     summary: List programs
  *     parameters:
  *       - name        : limit
  *         description : how many items you want to see
  *         in          : query
  *         required    : true
  *         type        : integer
  *       - name        : page
  *         description : count of items you want to skip (limit * page) from 1
  *         in          : query
  *         required    : true
  *         type        : integer
  * 
  *     responses:
  *       200:
  *         description: Success
  *         example: {
                "data": [
                    {
                    "id": 19,
                    "trainer_id": 2,
                    "gender": "male",
                    "status": 2,
                    "goal_direction": "Weight Loss",
                    "fitness_level": "beginner",
                    "count_of_weeks": 16,
                    "lean_mass_goal": 100,
                    "weight_loss_goal": 100,
                    "workout_sessions_per_week": 5,
                    "start_date": "2000-10-19T21:00:00.000Z",
                    "term": 2,
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
                    "total": 15,
                    "perPage": 2,
                    "page": 8,
                    "lastPage": 8
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
*/

module.exports = List;