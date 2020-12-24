'use strict'
const Create       = use('App/Services/Forecast/Create');
const Delete       = use('App/Services/Forecast/Delete');
const Show         = use('App/Services/Forecast/Show');
const Change       = use('App/Services/Forecast/Change');
const List         = use('App/Services/Forecast/List');
const Assign       = use('App/Services/Forecast/Assign');
const DeleteAssign = use('App/Services/Forecast/DeleteAssign');

class ForecastController {
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

    async change({request, auth, response}) {
        const useCase = new Change();
        return useCase.execute(request, auth, response);
    }

    async delete({request, auth, response}) {
        const useCase = new Delete();
        return useCase.execute(request, auth, response);
    }

    async assignToProgram({request, auth, response}) {
        const useCase = new Assign();
        return useCase.execute(request, auth, response);
    }

    async deleteAssignToProgram({request, auth, response}) {
        const useCase = new DeleteAssign();
        return useCase.execute(request, auth, response);
    }
}

module.exports = ForecastController;
