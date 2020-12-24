'use strict'
const Create = use('App/Services/FavoriteExercise/Create');
const Delete = use('App/Services/FavoriteExercise/Delete');

class FavoriteExercisesController {
    async create({request, auth, response}) {
        const useCase = new Create();
        return useCase.execute(request, auth, response);
    }

    async delete({request, auth, response}) {
        const useCase = new Delete();
        return useCase.execute(request, auth, response);
    }
}


module.exports = FavoriteExercisesController;
