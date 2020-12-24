'use strict'

const User     = use('App/Models/User');
const Workout  = use('App/Models/Workout');
const Database = use('Database');
const ExerciseGroup = use('App/Models/ExerciseGroup');

class DeleteItem {
    async execute(request, auth, response) {
        try {
            const userId = auth.user.id;
            const relationGroupId = request.params.id;

            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const groupItem = await Database.raw(`
                SELECT * FROM exercise_groups_items
                WHERE id = ${relationGroupId}
            `);
            if (!groupItem.rows || !groupItem.rows[0]) {
                return response.status(400).json({ message: 'there is no group item' });
            }
            
            const group = await ExerciseGroup.find(groupItem.rows[0].group_id);
            if (!group) {
                return response.status(400).json({ message: 'there is no group' });
            }

            const workout = await Workout.find(group.workout_id);
            if (!workout) {
                return response.status(400).json({ message: 'There is no workout' });
            }

            const doUserHasPermissions = await user.checkWorkoutPermissions(workout, 'write');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }

            await Database.raw(`
                DELETE FROM exercise_groups_items
                where id = ${relationGroupId}
            `);
            
            return response.status(200).json({ 
                message : "Exercise was successfully deleted from group"
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/exercise/group/delete/item/{id}:
  *   delete:
  *     tags:
  *       - Exercise Groups API
  *     security:
  *       - bearerAuth: []
  *     summary: delete exercise from group
  *     parameters:
  *       - name        : id
  *         description : unique identifier of exercise item in group
  *         in          : path
  *         required    : true
  * 
  *     responses:
  *       200:
  *         description: Success
  *         example: {
                "message" : "Exercise was successfully deleted from group"
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

module.exports = DeleteItem;