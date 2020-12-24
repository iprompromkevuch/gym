'use strict'

const User     = use('App/Models/User');
const Program  = use('App/Models/Program');
const dumps    = use('App/Utils/dumps');

class DeleteAssignment {
    async execute(request, auth, response) {
        try {
            const input = request.all();
            const userId = input.user_id;
            const programId = request.params.program_id;
            
            await Program.deleteAssignmentFromUser(programId, userId);

            return response.status(201).json({ 
                "message": `program with id ${programId} was unassigned from user with id ${userId}`
            });
        } catch (err) {
            console.log(err, 'err')
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/program/assign/{program_id}:
  *   delete:
  *     tags:
  *       - Program API
  *     security:
  *       - bearerAuth: []
  *     summary: Delete assignment
  *     parameters:
  *       - name        : user_id
  *         description : user id
  *         in          : query
  *         type        : integer
  *       - name        : program_id
  *         description : program that should be unassigned from this user
  *         in          : path
  *         type        : integer
  * 
  *     responses:
  *       201:
  *         description: Success
  *         example:
  *           response: {
                "message": "program with id 1 was unassigned from user with id 1"
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

module.exports = DeleteAssignment;