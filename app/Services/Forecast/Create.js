'use strict'

const Forecast = use('App/Models/Forecast');
const User     = use('App/Models/User');
const Database = use('Database');
const dumps    = use('App/Utils/dumps');

class Create {
    async execute(request, auth, response) {
        try {
            const input = request.all();
            const userId = auth.user.id;

            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const isCompanyAllowed = await user.checkCompanyPermissions(input.company_id);
            if (!isCompanyAllowed) {
                return response.status(400).json({ message: 'you have no permissions in this company' });
            }

            const isAdmin = await user.isAdmin();
            
            const forecastData = {
                created_by        : userId,
                company_id        : input.company_id,
                name              : input.name,
                gender            : input.gender,
                goal_direction    : input.goal_direction,
                fitness_level     : input.fitness_level,
                term              : input.term,
                style             : input.style,
                rest              : input.rest,
                sequence          : input.sequence,
                is_system_default : isAdmin ? true : false 
            }
            
            const result = await Forecast.create(forecastData);

            return response.status(201).json({ 
                data : result ? dumps.dumpForecast(result) : {}
            });
        } catch (err) {
            console.log(err.stack, 'err')
            return response.status(500).json({ error : err })
        }
    }
}

module.exports = Create;


/**
  * @swagger
  * /api/v1/forecast:
  *   post:
  *     tags:
  *       - Forecast API
  *     security:
  *       - bearerAuth: []
  *     summary: Create forecast
  *     parameters:
  *       - name        : name
  *         description : forecast name
  *         in          : query
  *         required    : true
  *         type        : string
  *       - name        : gender
  *         description : for which gender is this forecast (one of male, female)
  *         in          : query
  *         required    : true
  *         type        : string
  *       - name        : goal_direction
  *         description : goal
  *         in          : query
  *         required    : true
  *         type        : string
  *       - name        : fitness_level
  *         description : fitness level
  *         in          : query
  *         required    : true
  *         type        : string
  *       - name        : term
  *         description : term
  *         in          : query
  *         required    : true
  *         type        : string
  *       - name        : style
  *         description : style
  *         in          : query
  *         required    : true
  *         type        : string
  *       - name        : rest
  *         description : rest
  *         in          : query
  *         required    : true
  *         type        : string
  *       - name        : sequence
  *         description : sequence
  *         in          : query
  *         required    : true
  *         type        : string
  *       - name        : company_id
  *         description : company_id
  *         in          : query
  *         required    : true
  *         type        : integer
  * 
  *     responses:
  *       200:
  *         description: Success
  *         example:
  *           response: {
                "message": "Forecast was successfully created"
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