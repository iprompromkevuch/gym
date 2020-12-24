'use strict'

const User     = use('App/Models/User');
const Workout  = use('App/Models/Workout');

class Delete {
    async execute(request, auth, response) {
        try {
            const workoutId = request.params.id;
            const userId = auth.user.id;

            console.log(workoutId, userId);

            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const workout = await Workout.find(workoutId);
            if (!workout) {
                return response.status(400).json({ message: 'Workout doesnt exist' });
            }

            const isAssignedToProgram = await workout.isAssignedToProgram();
            if (isAssignedToProgram) {
                return response.status(400).json({ 
                    message: 'Workout is assigned to a program, you cant delete it' 
                });
            }
            
            const doUserHasPermissions = await user.checkWorkoutPermissions(workout, 'write');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }
            
            await workout.delete();

            return response.status(200).json({ 
                message : 'Workout was successfully deleted' 
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/workout/{id}:
  *   delete:
  *     tags:
  *       - Workout API
  *     security:
  *       - bearerAuth: []
  *     summary: delete workout
  *     parameters:
  *       - name        : id
  *         description : workout you want to delete id
  *         in          : path
  *         required    : true
  *         type        : integer
  * 
  *     responses:
  *       200:
  *         description: success
  *         example:
  *           response: {
                "message" : "Workout was successfully deleted"
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
  *       400:
  *         description: assignment
  *         example:
  *             response: {
                    "message": "Workout is assigned to a program, you cant delete it"
                }
  *       403:
  *         description: You try to reach resources you have no access
  *         example:
  *             response: {
                    "message": "User has no permissions"
                }
*/

module.exports = Delete;