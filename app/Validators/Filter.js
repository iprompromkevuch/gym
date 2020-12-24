'use strict'
const { validate, rule, formatters } = use('Validator')

class ExerciseGetAvailableWithRestrictions {
  get rules() {
      return {
        'filters.*.field' : 'required|string|in:ability_level,type,favorite',
        'filters.*.value' : 'required',
        'sort.field'      : 'string|in:ability_level,type,favorite',
        'sort.order'      : 'string|in:ASC,DESC',
      }
  }
  
  async fails (errorMessages) {
    return this.ctx.response.status(422).json(errorMessages)
  }
  
  get formatter () {
    return formatters.JsonApi
  }
}

module.exports = ExerciseGetAvailableWithRestrictions;
