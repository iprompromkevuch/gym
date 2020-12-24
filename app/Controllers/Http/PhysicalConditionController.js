'use strict'
const Show      = use('App/Services/PhysicalCondition/Show');
const Create    = use('App/Services/PhysicalCondition/Create');
const Change    = use('App/Services/PhysicalCondition/Change');
const Calculate = use('App/Services/PhysicalCondition/Calculate');
const List      = use('App/Services/PhysicalCondition/List');

class PhysicalConditionController {
    async show({request, auth, response}) {
        const useCase = new Show();
        return useCase.execute(request, auth, response);
    }

    async create({request, auth, response}) {
        const useCase = new Create();
        return useCase.execute(request, auth, response);
    }

    async change({request, auth, response}) {
        const useCase = new Change();
        return useCase.execute(request, auth, response);
    }

    async calculate({request, auth, response}) {
        const useCase = new Calculate();
        return useCase.execute(request, auth, response);
    }

    async list({request, auth, response}) {
        const useCase = new List();
        return useCase.execute(request, auth, response);
    }

}

module.exports = PhysicalConditionController;