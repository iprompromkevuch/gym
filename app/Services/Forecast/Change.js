'use strict'

const Forecast = use('App/Models/Forecast');
const User     = use('App/Models/User');
const dumps    = use('App/Utils/dumps');

class Change {
    async execute(request, auth, response) {
        try {
            const input = request.all();
            const userId = auth.user.id;
            const forecastId = request.params.id;

            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const forecast = await Forecast.find(forecastId);
            if (!forecast) {
                return response.status(400).json({ message: 'forecast doesnt exist' });
            }

            const count = await forecast.isAssignedToProgram();
            if (count !== '0') {
                return response.status(400).json({ 
                    message: 'This forecast is assigned program' 
                });
            }

            const doUserHasPermissions = await user.checkForecastPermissions(forecast, 'write');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }

            const forecastData = {
                name           : input.name,
                gender         : input.gender,
                goal_direction : input.goal_direction,
                fitness_level  : input.fitness_level,
                term           : input.term,
                style          : input.style,
                rest           : input.rest,
                sequence       : input.sequence   
            }

            forecast.merge(forecastData);
            await forecast.save(); 
            return response.status(201).json({ 
                data : forecast ? dumps.dumpForecast(forecast) : {}
            });
        } catch (err) {
            console.log(err)
            return response.status(500).json({ error : err })
        }
    }
}

module.exports = Change;


/**
  * @swagger
  * /api/v1/forecast/{id}:
  *   put:
  *     tags:
  *       - Forecast API
  *     security:
  *       - bearerAuth: []
  *     summary: Change forecast
  *     parameters:
  *       - name        : id
  *         description : id of forecast
  *         in          : path
  *         required    : true
  *         type        : integer
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
  * 
  *     responses:
  *       201:
  *         description: Success
  *         example:
  *           response: {
                "message": "Forecast was successfully changed"
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