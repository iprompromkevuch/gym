'use strict'

const PhysicalCondition = use('App/Models/PhysicalCondition');
const User              = use('App/Models/User');

class Create {
    async execute(request, auth, response) {
        try {
            const input = request.all();
            const userId = auth.user.id;

            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const weight = input.weight;
            const gender = input.gender;
            const isGenderValid = gender === 'male' || gender === 'female' ? true : false;
            if (!isGenderValid) {
                return response.status(400).json({ message : "please, provide genders 'male' or 'female'" })
            }

            const physConditions = {
                tricep      : +input.tricep,
                chest       : +input.chest,
                subscapular : +input.subscapular,
                suprailiac  : +input.suprailiac,
                abdominal   : +input.abdominal,
                midaxillary : +input.midaxillary,
                thigh       : +input.thigh,
            }

            const age = +input.age;

            const total_body_fat_p = await PhysicalCondition.calculateBodyFatPercentageWithAge(user, physConditions, age, gender);
            const lean_mass = await PhysicalCondition.calculateLeanMass(total_body_fat_p, weight);
    
            return response.status(201).json({ data: {
                bodyFat  : total_body_fat_p,
                bodyMass : lean_mass
            }});
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}


  /**
  * @swagger
  * /api/v1/physical-condition/calculate:
  *   post:
  *     tags:
  *       - Physical condition API
  *     security:
  *       - bearerAuth: []
  *     summary: Get info of body mass and body fat for a specific set of measurements
  *     parameters:
  *       - name        : age
  *         description : client age
  *         in          : query
  *         required    : true
  *         type        : integer
  *       - name        : gender
  *         description : client gender (one of male, female)
  *         in          : query
  *         required    : true
  *         type        : string
  *       - name        : weight
  *         description : client weight
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : tricep
  *         description : client tricep
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : chest
  *         description : client chest
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : tricep
  *         description : client tricep
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : subscapular
  *         description : client subscapular
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : suprailiac
  *         description : client suprailiac
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : abdominal
  *         description : client abdominal
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : midaxillary
  *         description : client midaxillary
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : thigh
  *         description : client thigh
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *     responses:
  *       201:
  *         description: Info 
  *         example:
  *           response: {
                "data": {
                    "bodyFat": 8.84,
                    "bodyMass": 4.558
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