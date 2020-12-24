'use strict'
const { formatters } = use('Validator')

class Login {
  get rules () {
    return {
      email: 'required',
      password: 'required'
    }
  }
  
  async fails (errorMessages) {
    return this.ctx.response.status(422).json(errorMessages)
  }
  
  get formatter () {
    return formatters.JsonApi
  }
}

module.exports = Login
