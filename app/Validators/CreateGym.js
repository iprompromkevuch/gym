'use strict'
const { validate, rule, formatters } = use('Validator');

class CreateGym {
  get rules() {
      return {
          name: 'required|max:200',
          phone: 'required|max:20',
          email: 'required|email|max:150',
          city: 'required|max:255',
          state: 'required|max:50',
          address_line1: 'required',
          zip: 'required|max:254',
          company_id: 'required|integer',
          status: 'required|integer'
      }
    }
  
    async fails (errorMessages) {
        return this.ctx.response.status(422).json(errorMessages)
    }
  
    get formatter () {
      return formatters.JsonApi
    }
}

module.exports = CreateGym
