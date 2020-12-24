'use strict'

const User     = use('App/Models/User');
const Workout  = use('App/Models/Workout');
const dumps    = use('App/Utils/dumps');
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

            const workouts = await Workout.getAvailable(user, limit, page);

            return response.status(200).json({ 
                data : workouts.data
                    ? workouts.data.map((item) => dumps.dumpWorkout(item))
                    : workouts.map((item) => dumps.dumpWorkout(item)),
                pagination : pagination(workouts, limit, page)
            });
        } catch (err) {
            console.log(err)
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/workout?limit={limit}&page={page}:
  *   get:
  *     tags:
  *       - Workout API
  *     security:
  *       - bearerAuth: []
  *     summary: show all workouts of authorized user
  *     parameters:
  *       - name        : limit
  *         description : how many workouts you want to see
  *         in          : query
  *         required    : true
  *       - name        : page
  *         description : how many items you want to skip (limit * page) page from 1
  *         in          : query
  *         required    : true
  * 
  *     responses:
  *       200:
  *         description: success
  *         example:
  *           response: {
                "data": {
                    "workouts": [
                        {
                            "id": 8,
                            "assigned_to": 1,
                            "created_by": 1,
                            "company_id": 2,
                            "role_id": 2
                        }
                    ],
                    "pagination": {
                        "total": "1",
                        "perPage": 10,
                        "page": 1,
                        "lastPage": 1
                    }
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
*/

module.exports = List;