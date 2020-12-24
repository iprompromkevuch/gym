'use strict'

const Show                = use('App/Services/ExerciseGroups/Show');
const AddToGroup          = use('App/Services/ExerciseGroups/AddToGroup');
const DeleteItem          = use('App/Services/ExerciseGroups/DeleteItem');
const Create              = use('App/Services/ExerciseGroups/Create');
const Delete              = use('App/Services/ExerciseGroups/Delete');
const ChangeExerciseOrder = use('App/Services/ExerciseGroups/ChangeExerciseOrder');

class ExerciseGroupsController {
    async show({request, auth, response}) {
        const useCase = new Show();
        return useCase.execute(request, auth, response);
    }

    async addToGroup({request, auth, response}) {
        const useCase = new AddToGroup();
        return useCase.execute(request, auth, response);
    }

    async deleteItem({request, auth, response}) {
        const useCase = new DeleteItem();
        return useCase.execute(request, auth, response);
    }

    async create({request, auth, response}) {
        const useCase = new Create();
        return useCase.execute(request, auth, response);
    }

    async delete({request, auth, response}) {
        const useCase = new Delete();
        return useCase.execute(request, auth, response);
    }

    async changeExerciseOrder({request, auth, response}) {
        const useCase = new ChangeExerciseOrder();
        return useCase.execute(request, auth, response);
    }
}

module.exports = ExerciseGroupsController;
