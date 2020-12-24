'use strict'

const Exercise = use('App/Models/Exercise');
const User     = use('App/Models/User');

const dumps    = use('App/Utils/dumps');
const Database = use('Database');

class Change {
    async execute(request, auth, response) {
        try {
            const data = request.all();
            const exerciseId = request.params.id;

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

            const user = await User.find(auth.user.id);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const isCompanyAllowed = await user.checkCompanyPermissions(data.company_id);
            if (!isCompanyAllowed) {
                return response.status(400).json({ message: 'you have no permissions in this company' });
            }
            
            const exercise = await Exercise.find(exerciseId);
            if (!exercise) {
                return response.status(400).json({ message: 'We dont have this exercise' });
            }

            const doUserHasPermissions = await user.checkExercisePermissions(exercise, 'write');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }

            // data without ability level and with created by
            const exerciseData = {
                primary_muscle_id : data.primary_muscle_id,
                type              : data.type,
                name              : data.name,
                description       : data.description,
                company_id        : data.company_id,
                created_by        : auth.user.id
            }

            await Exercise.query()
                .where('id', exercise.id)
                .update(exerciseData);

            const abilities = abilitiesInput.map((item) => { return {
                exercise_id : exercise.id,
                ability_id  : item
            }});

            await Database.table('exercise_ability_relations')
                .where('exercise_id', exercise.id).delete();
            await Database.table('exercise_ability_relations').insert(abilities);

            const result = await Exercise.getFullDataAboutOneExercise(exercise.id, user.id);

            return response.status(201).json({ 
                "data" : dumps.dumpExercise(result)
            });
        } catch (err) {
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/exercise/{id}:
  *   put:
  *     tags:
  *       - Exercise API
  *     security:
  *       - bearerAuth: []
  *     summary: Change exercise
  *     parameters:
  *       - name        : id
  *         description : id of exercise
  *         in          : path
  *         required    : true
  *         type        : integer
  *       - name        : primary_muscle_id
  *         description : primary muscle for exercises [1 - Legs, 2 - Arms, 3 - Shoulders, 4 - Back, 5 - Chest, 6 - Cardio]
  *         in          : query
  *         required    : true
  *         type        : integer
  *       - name        : ability level
  *         description : ability level you need to do this exercise [1 - beginner, 2 - intermediate, 3 - advanced] (or combination)
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
  *         description : type of exercise
  *         in          : query
  *         required    : true
  *         type        : integer
  *       - name        : name
  *         description : exercise name
  *         in          : query
  *         required    : true
  *         type        : string
  *       - name        : description
  *         description : exercise description
  *         in          : query
  *         required    : true
  *         type        : string
  *       - name        : company_id
  *         description : from which company user creates exercise
  *         in          : query
  *         required    : true
  *         type        : integer
  * 
  *     responses:
  *       201:
  *         description: Success
  *         example:
  *             response: {
                    "data": {
                            "id": 49,
                            "primary_muscle": "Cardio",
                            "ability_level": "intermediate",
                            "type": "sad",
                            "name": "ew",
                            "description": "2eds",
                            "created_by": 1,
                            "is_system_default": false,
                            "is_favorite": false
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