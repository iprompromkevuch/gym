'use strict'

const Exercise = use('App/Models/Exercise');
const User     = use('App/Models/User');
const Workout  = use('App/Models/Workout');
const Database = use('Database');
const dumps    = use('App/Utils/dumps');
const ExerciseGroup = use('App/Models/ExerciseGroup');

class Delete {
    async execute(request, auth, response) {
        try {
            const groupId = request.params.id;
            const userId = auth.user.id;
            
            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const group = await ExerciseGroup.find(groupId);
            if (!group) {
                return response.status(400).json({ message: 'there is no group' });
            }
            
            const workout = await Workout.find(group.workout_id);
            if (!workout) {
                return response.status(400).json({ message: 'There is no workout' });
            }

            const doUserHasPermissions = await user.checkWorkoutPermissions(workout, 'read');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }

            await group.delete();

            await Database.raw(`
                DELETE FROM exercise_groups_items
                where group_id = ${groupId}
            `)
            
            return response.status(200).json({ 
                message : "Group was successfully deleted"
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/exercise/group/{id}:
  *   delete:
  *     tags:
  *       - Exercise Groups API
  *     security:
  *       - bearerAuth: []
  *     summary: delete group
  *     parameters:
  *       - name        : id
  *         description : unique identifier of group
  *         in          : path
  *         required    : true
  * 
  *     responses:
  *       200:
  *         description: Success
  *         example: {
               "message" : "Group was successfully deleted" 
            }
  *       403:
  *         description: You try to reach resources you have no access
  *         example: {
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

module.exports = Delete;