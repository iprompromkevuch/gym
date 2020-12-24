'use strict'
const { validate, rule, formatters } = use('Validator')

class ListFiltered {
  get rules() {
      return {
        'page'                 : 'required|integer',
        'limit'                : 'required|integer',
        'goal_filter'          : 'string|in:Weight Loss,Re-costruction,Maintaince,Weight gain,Contest',
        'gender_filter'        : 'string|in:male,female',
        'fitness_level_filter' : 'string|in:beginner,semi-moderate,intermediate,heavy,pro',
      }
  }
  
  async fails (errorMessages) {
    return this.ctx.response.status(422).json(errorMessages)
  }
  
  get formatter () {
    return formatters.JsonApi
  }
}

module.exports = ListFiltered;
