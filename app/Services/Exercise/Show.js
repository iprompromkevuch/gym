'use strict'

const Exercise = use('App/Models/Exercise');
const User     = use('App/Models/User');
const Muscle   = use('App/Models/Muscle');

const Database = use('Database');
const dumps    = use('App/Utils/dumps');

class Show {
    async execute(request, auth, response) {
        try {
            const exerciseId = request.params.id;
            const userId     = auth.user.id;

            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }
            
            const exercise = await Exercise.getFullDataAboutOneExercise(exerciseId, userId);
            if (!exercise) {
                return response.status(400).json({ message: 'We dont have this exercise' });
            }
            
            const doUserHasPermissions = await user.checkExercisePermissions(exercise, 'read');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }

            return response.status(200).json({ 
                data : dumps.dumpExercise(exercise)
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/exercise/{id}:
  *   get:
  *     tags:
  *       - Exercise API
  *     security:
  *       - bearerAuth: []
  *     summary: show exercise by id
  *     parameters:
  *       - name        : id
  *         description : unique identifier of exercise
  *         in          : path
  *         required    : true
  * 
  *     responses:
  *       200:
  *         description: Success
  *         example:
  *             response: {
                    "data":
                        {
                            "id"                : 1,
                            "primary_muscle"    : 1,
                            "ability_level"     : "beginner",
                            "type"              : "type",
                            "name"              : "some name",
                            "description"       : "this exercise is for ...",
                            "created_by"        : 1,
                            "company_id"        : 1,
                            "is_system_default" : true,
                            "is_favorite"       : false
                        }
                    }
  *       403:
  *         description: You try to reach resources you have no access
  *         example:
  *             response: {
                    "message": "User has no permissions"
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


module.exports = Show;