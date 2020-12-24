'use strict'

const User    = use('App/Models/User');
const Program = use('App/Models/Program');
const Database = use('Database');

class Delete {
    async execute(request, auth, response) {
        try {
            const programId = request.params.id;
            const userId = auth.user.id;
            
            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const program = await Program.find(programId);
            if (!program) {
                return response.status(400).json({ message: 'We dont have this program' });
            }

            const doUserHasPermissions = await user.checkProgramPermissions(program, 'write');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }

            const isProgramAssigned = await Database.raw(`
                SELECT * FROM program_user_relations
                where program_id = ${programId}
            `);
            console.log('isProgramAssigned', isProgramAssigned.rows[0]);

            if (isProgramAssigned.rows[0]) {
                return response.status(400).json({ message: 'You cannot delete program that already assigned to user' });
            } 
            // if applied to client -> can't delete
            await program.delete();

            return response.status(200).json({ 
                message : "Program was successfully deleted"
            });
        } catch (err) {
            console.log(err.stack, 'err')
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/program/{id}:
  *   delete:
  *     tags:
  *       - Program API
  *     security:
  *       - bearerAuth: []
  *     summary: Delete program
  *     parameters:
  *       - name        : id
  *         description : id of program you want to delete
  *         in          : path
  *         required    : true
  *         type        : integer
  * 
  *     responses:
  *       200:
  *         description: Success
  *         example:
  *           response: {
                    "message" : "Program was successfully deleted"
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

module.exports = Delete;