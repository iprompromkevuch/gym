'use strict'

const Exercise = require("../../Models/Exercise");

const User     = use('App/Models/User');
const Workout  = use('App/Models/Workout');
const Database = use('Database');
const dumps    = use('App/Utils/dumps');
const ExerciseGroup = use('App/Models/ExerciseGroup');

class ChangeExerciseOrder {
    async execute(request, auth, response) {
        try {
            const groupId = request.params.id;
            const userId = auth.user.id;
            const input = request.all();
            const exerciseIdArray = input.exercise_ids;
            
            if (exerciseIdArray.length <= 0 || exerciseIdArray.length !== new Set(exerciseIdArray).size) {
                return response.status(400).json({ message : "Wrong exercise ids count or group id value" });
            }

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

            const doUserHasPermissions = await user.checkWorkoutPermissions(workout, 'write');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }

            let isValidInputArray = true;
            const groupExercises = await Database.raw(`
                Select * from exercise_groups_items
                where group_id = ${groupId}
            `);

            if (groupExercises.rows.length !== exerciseIdArray.length) {
                isValidInputArray = false;
            } else {
                groupExercises.rows.forEach(item => {
                    if (!exerciseIdArray.includes(item.id)) {
                        isValidInputArray = false;
                    }
                });
            }

            if (!isValidInputArray) {
                return response.status(400).json({ message : "Wrong exercise ids count or group id value" });
            }

            const valuesToSql = groupExercises.rows.map((item, index) => {
                return `(${exerciseIdArray[index]}, ${item.group_id}, ${item.exercise_id}, ${index + 1})`;
            }).join(',');

            console.log(valuesToSql);
            await Database.raw(`
                INSERT INTO exercise_groups_items (id, group_id, exercise_id, "order") 
                VALUES ${valuesToSql}
                ON CONFLICT (id) DO UPDATE 
                    SET "order" = excluded.order
            `);

            const groupUpdatedExercises = await Exercise.findByGroup(groupId, userId);

            return response.status(201).json({ 
                data : groupUpdatedExercises.map(item => dumps.dumpExercise(item))
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/exercise/group/{id}/order:
  *   put:
  *     tags:
  *       - Exercise Groups API
  *     security:
  *       - bearerAuth: []
  *     summary: change groups order
  *     parameters:
  *       - name        : id
  *         description : id of group
  *         in          : path
  *         required    : true
  *         type        : string
  *       - name        : exercise_ids
  *         description : relation ids of exercises in group in right order
  *         in          : body
  *         required    : true
  *         schema      :
  *           type: object
  *           properties:
  *             exercise_ids:
  *               type: array
  *               description: some
  *               items:
  *                 type: integer
  *               uniqueItems: true
  * 
  *     responses:
  *       201:
  *         description: success
  *         example: {
                "data": [
                    {
                    "id": 1,
                    "exercise_groups_items_id": 1,
                    "order": 1,
                    "primary_muscle_id": 1,
                    "primary_muscle": "Legs",
                    "ability_level": [],
                    "type": "sad",
                    "name": "sa",
                    "description": "sda",
                    "created_by": 2,
                    "company_id": 1,
                    "is_system_default": true,
                    "is_favorite": true
                    },
                    {
                    "id": 2,
                    "exercise_groups_items_id": 2,
                    "order": 3,
                    "primary_muscle_id": 1,
                    "primary_muscle": "Legs",
                    "ability_level": [],
                    "type": "dwssadsad",
                    "name": "sd",
                    "description": "ds",
                    "created_by": 2,
                    "company_id": 2,
                    "is_system_default": false,
                    "is_favorite": true
                    },
                    {
                    "id": 7,
                    "exercise_groups_items_id": 3,
                    "order": 2,
                    "primary_muscle_id": 1,
                    "primary_muscle": "Legs",
                    "ability_level": [],
                    "type": "dwssadsad",
                    "name": "sd",
                    "description": "ds",
                    "created_by": 2,
                    "company_id": 2,
                    "is_system_default": false,
                    "is_favorite": false
                    }
                ]
            }
  *       400:
  *         description: Not authorized
  *         example:
  *           response: {
                "error": {
                    "message": "There is no workout"
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

module.exports = ChangeExerciseOrder;