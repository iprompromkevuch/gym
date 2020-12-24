'use strict'

const Exercise = use('App/Models/Exercise');
const User     = use('App/Models/User');
const Workout  = use('App/Models/Workout');
const dumps    = use('App/Utils/dumps');
const Database = use('Database');

class Change {
    async execute(request, auth, response) {
        try {
            const data = request.all();
            const workoutId = request.params.id;
            const userId = auth.user.id;

            let validator = true;
            let abilitiesInput;
            if (typeof data.ability_level === 'string') {
                abilitiesInput = data.ability_level.split(',');
            } else {
                abilitiesInput = data.ability_level;
            }
            
            abilitiesInput.forEach((item) => {
                if (item != 1 && item != 2 && item != 3) {
                    validator = false;
                }
            });
            if (!validator) {
                return response.status(422).json({ message: 'Ability level is not in range [1,3]' });
            }

            const isAbilityLevelUnique = Exercise.checkAbilityLevelUnique(abilitiesInput);
            if (!isAbilityLevelUnique) {
                return response.status(400).json({ message: 'Not unique ability levels' });
            }

            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const isCompanyAllowed = await user.checkCompanyPermissions(data.company_id);
            if (!isCompanyAllowed) {
                return response.status(400).json({ message: 'you have no permissions in this company' });
            }

            const workout = await Workout.find(workoutId);
            if (!workout) {
                return response.status(400).json({ message: 'Workout doesnt exist' });
            }

            const isAssignedToProgram = await workout.isAssignedToProgram();
            if (isAssignedToProgram) {
                return response.status(400).json({ 
                    message: 'Workout is assigned to a program, you cant change it' 
                });
            }
            
            const doUserHasPermissions = await user.checkWorkoutPermissions(workout, 'write');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }     

            const inputData = {
                name           : data.name,
                description    : data.description,
                type           : data.type,
                company_id     : data.company_id
            }

            workout.merge(inputData);
            await workout.save();

            const abilities = abilitiesInput.map((item) => { return {
                workout_id : workout.id,
                ability_id : item
            }});

            await Database.table('workout_ability_relations')
                .where('workout_id', workout.id).delete();
            await Database.table('workout_ability_relations').insert(abilities);

            const result = await Workout.getFullDataAboutOneWorkout(workout.id, user.id);

            return response.status(201).json({ 
                "data" : dumps.dumpWorkout(result)
            });
        } catch (err) {
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/workout/{id}:
  *   put:
  *     tags:
  *       - Workout API
  *     security:
  *       - bearerAuth: []
  *     summary: change workout
  *     parameters:
  *       - name        : id
  *         description : id of workout you want to change
  *         in          : path
  *         required    : true
  *         type        : string
  *       - name        : name
  *         description : name of workout
  *         in          : query
  *         required    : true
  *         type        : string
  *       - name        : description
  *         description : workout description
  *         in          : query
  *         required    : true
  *         type        : string
  *       - name        : ability level
  *         description : ability level [1 - beginner, 2 - intermediate, 3 - advanced] (or combination)
  *         in          : body
  *         required    : true
  *         schema      :
  *           type : object
  *           properties :
  *             ability_level :
  *               description : which exercises with which filters you want to get [{"field" - "ability_level", "value" - "beginner"} ...]
  *               type : array
  *               items :
  *                 type  : integer
  *       - name        : type
  *         description : type of workout
  *         in          : query
  *         required    : true
  *         type        : integer
  *       - name        : company_id
  *         description : id of company from which user wants to create workout
  *         in          : query
  *         required    : true
  *         type        : integer
  * 
  *     responses:
  *       201:
  *         description: success
  *         example:
  *           response: {
                "data": {
                    "id": 9,
                    "created_by": 1,
                    "name": "name",
                    "description": "des",
                    "activity_level": "sada",
                    "type": "dsasaf",
                    "company_id": "2",
                    "is_system_default": false
                }
            }
  *       400:
  *         description: Not authorized
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

module.exports = Change;