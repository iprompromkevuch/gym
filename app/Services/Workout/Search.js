'use strict'

const Exercise = use('App/Models/Exercise');
const User     = use('App/Models/User');
const Workout  = use('App/Models/Workout');
const dumps    = use('App/Utils/dumps');
const pagination = use('App/Utils/pagination');

class Search {
    async execute(request, auth, response) {
        try {
            //Show only those exercises created as system default exercises
            // ( created by system admin), exercises create by the companies 
            // for which the trainer is associated, or exercises created by themselves
            // + workout id
            const input = request.all();
            const limit = +input.limit;
            const page  = +input.page - 1;
            const sort  = input.sort || { field : "ability_level", order : "ASC" };
            const workoutId = input.workout_id;
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
            
            let favoriteSort = false;
            if (sort.field === 'favorite') favoriteSort = true

            const user = await User.find(auth.user.id);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }


            const workout = await Workout.find(workoutId);
            if (!workout) {
                return response.status(400).json({ message: 'Workout doesnt exist' });
            }

            const doUserHasPermissions = await user.checkWorkoutPermissions(workout, 'read');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }     

            const exercises = await Exercise.getFilteredInWorkout(
                workoutId, limit, page, filterWhereString, sort, isFavorite, user.id, favoriteSort);

            return response.status(200).json({
                data: exercises.data
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
  * /api/v1/workout/search/filter:
  *   post:
  *     tags:
  *       - Workout API
  *     security:
  *       - bearerAuth: []
  *     summary: show filtered exercises of workout
  *     parameters:
  *       - name        : limit
  *         description : how many exercises you need to see
  *         in          : query
  *         required    : true
  *         type        : integer
  *       - name        : page
  *         description : how many items you want to skip (limit * page) page from 1
  *         in          : query
  *         required    : true
  *         type        : integer
  *       - name        : workout_id
  *         description : exercises of which workout you want to find
  *         in          : query
  *         required    : true
  *         type        : integer
  *       - name        : filters
  *         description : sort and filter exercises by fields ability_level, type, favorite. sort.order is one of DESC, ASC 
  *         in          : body
  *         required    : true
  *         schema      :
  *           type : object
  *           properties :
  *             filters :
  *               description : which exercises with which filters you want to get 
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
  *               description : sort by fields with ASC or DESC order
  *               type : object
  *               properties:
  *                   field:
  *                       type : string
  *                   order:
  *                       type : string
  *               required :
  *                 - field
  *                 - value
  * 
  *     responses:
  *       200:
  *         description: success
  *         example:
  *           response: {
                "data": {
                    "exercises": [
                        {
                        }
                    ],
                    "pagination": {
                        "total": "1",
                        "perPage": 10,
                        "page": 1,
                        "lastPage": 1
                    }
                }
            }
  *       400:
  *         description: Not found
  *         example:
  *           response: {
                "error": {
                    "message": "Workout doesnt exist"
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

module.exports = Search;