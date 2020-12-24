'use strict'

const User             = use('App/Models/User');
const Database         = use('Database');

class Delete {
    async execute(request, auth, response) {
        try {
            const userId = auth.user.id;
            const exerciseId = request.params.id;

            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            await Database.table('favorite_exercises')
                .whereRaw('user_id = ? AND exercise_id = ?', [userId, exerciseId])
                .delete();

            return response.status(200).json({ 
                message : 'Exercise was successfully deleted from favorites' 
            })
        } catch (err) {
            return response.status(500).json({ error : err })
        }
    }
}

/**
  * @swagger
  * /api/v1/exercise/favorite/{id}:
  *   delete:
  *     tags:
  *       - Exercise API
  *     security:
  *       - bearerAuth: []
  *     summary: delete exercise from favorite
  *     parameters:
  *       - name        : id
  *         description : which exercise delete from favorites
  *         in          : path
  *         required    : true
  *         type        : integer
  * 
  *     responses:
  *       200:
  *         description: success
  *         example:
  *           response: {
                "message" : "Exercise was successfully deleted from favorites"
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