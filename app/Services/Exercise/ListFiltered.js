'use strict'

const Exercise = use('App/Models/Exercise');
const User     = use('App/Models/User');

const pagination = use('App/Utils/pagination');
const dumps    = use('App/Utils/dumps');

class ListFiltered {
    async execute(request, auth, response) {
        try {
            //Show only those exercises created as system default exercises
            // ( created by system admin) , exercises create by the companies 
            //for which the trainer is associated, or exercises created by themselves.
            const input = request.all();
            const limit = parseInt(input.limit, 10);
            const page  = parseInt(input.page, 10) - 1;
            const sort  = input.sort || { field : "ability_level", order : "ASC" };
            
            const filters = input.filters;

            // favorite joins in sql query, filters are using 'where' statements
            // that's why filters proccess in different way
            let isFavorite = false;
            let filterWhereString = '';
            for (let i = 0; i < filters.length; i++) {
                if (filters[i].field === 'favorite') {
                    isFavorite = true;
                } else {
                    filterWhereString += 
                        `${i === 0 ? '' : ' AND '}${filters[i].field} = '${filters[i].value}'`
                }
            }

            const user = await User.find(auth.user.id);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const exercises = await Exercise.getAvailableWithRestrictions(
                user, limit, page, filterWhereString, sort, isFavorite);

            return response.status(200).json({
                data : exercises.data
                ? exercises.data.map((item) => dumps.dumpExercise(item))
                : exercises.map((item) => dumps.dumpExercise(item)),
                pagination : pagination(exercises, limit, page)
            });
        } catch (err) {
            console.log(err)
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/exercise/list/filter?limit={limit}&page={page}:
  *   post:
  *     tags:
  *       - Exercise API
  *     security:
  *       - bearerAuth: []
  *     summary: show available exercises with filters and sorting
  *     parameters:
  *       - name        : limit
  *         description : how many exercises you need to see
  *         in          : path
  *         required    : true
  *         type        : integer
  *       - name        : page
  *         description : how many items you want to skip (limit * page) (from 1)
  *         in          : path
  *         required    : true
  *         type        : integer
  *       - name        : filters
  *         description : sort and filter which exercises with which filters you want to get [{"field" - "ability_level", "value" - "beginner"} ...] sort by fields with ASC or DESC
  *         in          : body
  *         required    : true
  *         schema      :
  *           type : object
  *           properties :
  *             filters :
  *               description : which exercises with which filters you want to get [{"field" - "ability_level", "value" - "beginner"} ...]
  *               type : array
  *               items    :
  *                 type  : object
  *                 required :
  *                   - field
  *                   - value
  *                 properties:
  *                   field:
  *                       type : string
  *                   value:
  *                       type : string
  *             sort :
  *               description : sort by fields with ASC or DESC
  *               type : object
  *               properties:
  *                   field:
  *                       type : string
  *                   order:
  *                       type : string
  *               required :
  *                 - field
  *                 - value
  *     responses:
  *       200:
  *         description: available exercises
  *         example: {
                "data": [
                    {
                    "id": 6,
                    "primary_muscle_id": 2,
                    "primary_muscle": "Arms",
                    "ability_level": [
                        1
                    ],
                    "type": "2",
                    "name": "2",
                    "description": "2",
                    "created_by": 2,
                    "is_system_default": false,
                    "is_favorite": false
                    },
                    {
                    "id": 2,
                    "primary_muscle_id": 1,
                    "primary_muscle": "Legs",
                    "ability_level": [
                        1
                    ],
                    "type": "dwssadsad",
                    "name": "sd",
                    "description": "ds",
                    "created_by": 2,
                    "is_system_default": false,
                    "is_favorite": true
                    }
                ],
                "pagination": {
                    "total": 18,
                    "perPage": 2,
                    "page": 1,
                    "lastPage": 10
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
*/

module.exports = ListFiltered;