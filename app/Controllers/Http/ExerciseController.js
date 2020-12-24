'use strict'

const Show             = use('App/Services/Exercise/Show');
const ShowAllAvailable = use('App/Services/Exercise/ShowAllAvailable');
const ListFiltered     = use('App/Services/Exercise/ListFiltered');
const Create           = use('App/Services/Exercise/Create');
const Change           = use('App/Services/Exercise/Change');
const Delete           = use('App/Services/Exercise/Delete');
const AssignToWorkout  = use('App/Services/Exercise/AssignToWorkout');
const DeleteAssignment = use('App/Services/Exercise/DeleteAssignment');

class ExerciseController {
    async show({request, auth, response}) {
        const useCase = new Show();
        return useCase.execute(request, auth, response);
    }

    async showAllAvailable({request, auth, response}) {
        const useCase = new ShowAllAvailable();
        return useCase.execute(request, auth, response);
    }

    async listFiltered({request, auth, response}) {
        const useCase = new ListFiltered();
        return useCase.execute(request, auth, response);
    }

    async assignToWorkout({request, auth, response}) {
        const useCase = new AssignToWorkout();
        return useCase.execute(request, auth, response);
    }

    async deleteAssignment({request, auth, response}) {
        const useCase = new DeleteAssignment();
        return useCase.execute(request, auth, response);
    }

    async change({request, auth, response}) {
        const useCase = new Change();
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
}

module.exports = ExerciseController;
