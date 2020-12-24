'use strict'

const User     = use('App/Models/User');
const Program  = use('App/Models/Program');
const dumps    = use('App/Utils/dumps');
const Database = use('Database');

class AssignToUser {
    async execute(request, auth, response) {
        try {
            const input = request.all();
            const userId = auth.user.id;
            const assignToUserId = input.user_id;
            const programId = input.program_id;

            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }
            
            const isCompanyAllowed = await user.checkCompanyPermissions(input.company_id);
            if (!isCompanyAllowed) {
                return response.status(400).json({ message: 'you have no permissions in this company' });
            }
            
            const isProgramAlreadyAssigned = await Database.raw(`
                SELECT * FROM program_user_relations
                WHERE user_id = ${assignToUserId}
            `);
            if (isProgramAlreadyAssigned.rows[0]) {
                return response.status(400).json({ message: `user already has assigned program with id ${isProgramAlreadyAssigned.rows[0].program_id}` });
            }

            const result = await Program.assignToUser(programId, assignToUserId);
            if (!result) {
                return response.status(400).json({ message: `there are no such program` });
            }

            return response.status(201).json({ 
                "message": `program with id ${programId} was assigned to user with id ${assignToUserId}`
            });
        } catch (err) {
            console.log(err, 'err')
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/program/assign:
  *   post:
  *     tags:
  *       - Program API
  *     security:
  *       - bearerAuth: []
  *     summary: Assign program to user
  *     parameters:
  *       - name        : company_id
  *         description : id of company
  *         in          : query
  *         required    : true
  *         type        : integer
  *       - name        : user_id
  *         description : user id
  *         in          : query
  *         type        : integer
  *         required    : true
  *       - name        : program_id
  *         description : program that should be assigned to this user
  *         in          : query
  *         required    : true
  *         type        : integer
  * 
  *     responses:
  *       201:
  *         description: Success
  *         example:
  *           response: {
                "message": "program with id 1 was assigned to user with id 1"
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

module.exports = AssignToUser;