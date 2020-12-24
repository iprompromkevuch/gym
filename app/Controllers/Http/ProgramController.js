'use strict'
const Create   = use('App/Services/Program/Create');
const Delete   = use('App/Services/Program/Delete');
const Show     = use('App/Services/Program/Show');
const Change   = use('App/Services/Program/Change');
const List     = use('App/Services/Program/List');
const Assign   = use('App/Services/Program/AssignToUser');
const UnAssign = use('App/Services/Program/DeleteAssignment');
const ListFiltered = use('App/Services/Program/ListFiltered');

class ProgramController {
    async listFiltered({request, auth, response}) {
        const useCase = new ListFiltered();
        return useCase.execute(request, auth, response);
    }

    async assign({request, auth, response}) {
        const useCase = new Assign();
        return useCase.execute(request, auth, response);
    }

    async unAssign({request, auth, response}) {
        const useCase = new UnAssign();
        return useCase.execute(request, auth, response);
    }

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
}

module.exports = ProgramController;