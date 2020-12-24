'use strict'

const AddToFavorite    = use('App/Services/Workout/AddToFavorite');
const DeleteFavorite   = use('App/Services/Workout/DeleteFavorite');
const Create           = use('App/Services/Workout/Create');
const Delete           = use('App/Services/Workout/Delete');
const Show             = use('App/Services/Workout/Show');
const List             = use('App/Services/Workout/List');
const Change           = use('App/Services/Workout/Change');
const AssignToProgram  = use('App/Services/Workout/AssignToProgram');
const DeleteAssignment = use('App/Services/Workout/DeleteAssignment');
const Search           = use('App/Services/Workout/Search');
const GroupOrder       = use('App/Services/Workout/GroupOrder');

class WorkoutController {
    async create({request, auth, response}) {
        const useCase = new Create();
        return useCase.execute(request, auth, response);
    }

    async show({request, auth, response}) {
        const useCase = new Show();
        return useCase.execute(request, auth, response);
    }

    async list({request, auth, response}) {
        const useCase = new List();
        return useCase.execute(request, auth, response);
    }

    async search({request, auth, response}) {
        const useCase = new Search();
        return useCase.execute(request, auth, response);
    }

    async change({request, auth, response}) {
        const useCase = new Change();
        return useCase.execute(request, auth, response);
    }

    async delete({request, auth, response}) {
        const useCase = new Delete();
        return useCase.execute(request, auth, response);
    }

    async assignToProgram({request, auth, response}) {
        const useCase = new AssignToProgram();
        return useCase.execute(request, auth, response);
    }

    async deleteAssignment({request, auth, response}) {
        const useCase = new DeleteAssignment();
        return useCase.execute(request, auth, response);
    }

    async addToFavorite({request, auth, response}) {
        const useCase = new AddToFavorite();
        return useCase.execute(request, auth, response);
    }

    async deleteFavorite({request, auth, response}) {
        const useCase = new DeleteFavorite();
        return useCase.execute(request, auth, response);
    }

    async groupOrder({request, auth, response}) {
        const useCase = new GroupOrder();
        return useCase.execute(request, auth, response);
    }
}

module.exports = WorkoutController;
