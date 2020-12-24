'use strict'
const Create = use('App/Services/Phase/Create');

class PhaseController {
    async create({request, auth, response}) {
        const useCase = new Create();
        return useCase.execute(request, auth, response);
    }
}

module.exports = PhaseController;