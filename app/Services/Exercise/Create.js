'use strict'

const Exercise = use('App/Models/Exercise');
const User     = use('App/Models/User');

const dumps    = use('App/Utils/dumps');
const Database = use('Database');

class Create {
    async execute(request, auth, response) {
        try {
            const data = request.all();

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

            const user = await User.find(auth.user.id);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const isCompanyAllowed = await user.checkCompanyPermissions(data.company_id);
            if (!isCompanyAllowed) {
                return response.status(400).json({ message: 'you have no permissions in this company' });
            }

            const isAbilityLevelUnique = Exercise.checkAbilityLevelUnique(abilitiesInput);
            if (!isAbilityLevelUnique) {
                return response.status(400).json({ message: 'Not unique ability levels' });
            }

            const isAdmin = await user.isAdmin();

            // data without ability level and with created by, 
            // with is system default (creates by system admin)
            const exerciseData = {
                primary_muscle_id : data.primary_muscle_id,
                type              : data.type,
                name              : data.name,
                description       : data.description,
                company_id        : data.company_id,
                created_by        : auth.user.id,
                is_system_default : isAdmin ? true : false
            }
            
            const exercise = await Exercise.create(exerciseData);
            const abilities = abilitiesInput.map((item) => { return {
                exercise_id : exercise.id,
                ability_id  : item
            }});
            await Database.table('exercise_ability_relations').insert(abilities);
            const result = await Exercise.getFullDataAboutOneExercise(exercise.id, user.id);

            return response.status(201).json({ 
                "data" : dumps.dumpExercise(result)
            });
        } catch (err) {
            console.log(err)
            return response.status(500).json({ error : err })
        }
    }
}

/**
  * @swagger
  * /api/v1/exercise:
  *   post:
  *     tags:
  *       - Exercise API
  *     security:
  *       - bearerAuth: []
  *     summary: Create exercise
  *     parameters:
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
  *         description: Info of exercise
  *         example: {
                "data": {
                    "id": 14,
                    "primary_muscle": "Legs",
                    "ability_level": "beginner, intermediate",
                    "type": "1",
                    "name": "1",
                    "description": "1",
                    "created_by": 2,
                    "is_system_default": false,
                    "is_favorite": false
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

module.exports = Create;