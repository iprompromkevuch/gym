'use strict'
const List = use('App/Services/Muscles/List');

class PhaseController {
    async list({request, auth, response}) {
        const useCase = new List();
        return useCase.execute(request, auth, response);
    }
}

module.exports = PhaseController;