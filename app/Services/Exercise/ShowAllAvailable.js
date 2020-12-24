'use strict'

const Exercise   = use('App/Models/Exercise');
const User       = use('App/Models/User');
const pagination = use('App/Utils/pagination');
const dumps      = use('App/Utils/dumps');

class ShowAllAvailable {
    async execute(request, auth, response) {
        try {
            //Show only those exercises created as system default exercises
            // ( created by system admin) , exercises create by the companies 
            //for which the trainer is associated, or exercises created by themselves.
            const input = request.all();
            const limit = parseInt(input.limit, 10);
            const page  = parseInt(input.page, 10) - 1;

            const user = await User.find(auth.user.id);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const exercises = await Exercise.getAvailable(user, limit, page);
            return response.status(200).json({
                data  : exercises.data
                    ? exercises.data.map((item) => dumps.dumpExercise(item))
                    : exercises.map((item) => dumps.dumpExercise(item)),
                pagination : pagination(exercises, limit, page)
            });
        } catch (err) {
            console.log(err)
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/exercise/list/available?limit={limit}&page={page}:
  *   get:
  *     tags:
  *       - Exercise API
  *     security:
  *       - bearerAuth: []
  *     summary: show available exercises for authorized user
  *     parameters:
  *       - name        : limit
  *         description : how many exercises you need to see
  *         in          : path
  *         required    : true
  *       - name        : page
  *         description : how many items you want to skip (limit * page) from 1
  *         in          : path
  *         required    : true
  * 
  *     responses:
  *       200:
  *         description: available exercises
  *         example: {
                "data": [
                    {
                    "id": 3,
                    "primary_muscle_id": 1,
                    "primary_muscle": "Legs",
                    "ability_level": [
                        3
                    ],
                    "type": "dwssadsad",
                    "name": "sd",
                    "description": "ds",
                    "created_by": 2,
                    "is_system_default": false,
                    "is_favorite": false
                    },
                    {
                    "id": 4,
                    "primary_muscle_id": 1,
                    "primary_muscle": "Legs",
                    "ability_level": [
                        null
                    ],
                    "type": "dwssadsad",
                    "name": "sd",
                    "description": "ds",
                    "created_by": 2,
                    "is_system_default": false,
                    "is_favorite": false
                    }
                ],
                "pagination": {
                    "total": 42,
                    "perPage": 2,
                    "page": 2,
                    "lastPage": 22
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

module.exports = ShowAllAvailable;