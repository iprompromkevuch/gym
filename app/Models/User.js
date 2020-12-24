'use strict'
const Database = use('Database');
/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** 
*  @swagger
*  definitions:
*    User:
*      type: object
*      properties:
*        id:
*          type: uint
*        email:
*          type: string
*        password:
*          type: string
*        public_email:
*          type: string
*        first_name:
*          type: string
*        last_name:
*          type: string
*        state:
*          type: string
*        city:
*          type: string
*        address_line1:
*          type: text
*        address_line2:
*          type: text
*        phone:
*          type: string
*        sex:
*          type: string
*        birthdate:
*          type: date
*        profile_image:
*          type: text
*        bio:
*          type: text
*        
*      required:
*        - email
*        - password
*        - first_name
*        - last_name
*        - state
*        - city
*        - address_line1
*        - phone
*        - sex
*        - birthdate
*/

class User extends Model {
  static ROLES = {
    'client'      : 1,
    'trainer'     : 2,
    'owner'       : 3,
    'manager'     : 4,
    'sales agent' : 5,
    'admin'       : 6,
  };

  static MODES = ['read', 'write'];

  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }
  
  static get hidden () {
    return ['password','created_at','updated_at', 'is_admin']
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }
  
  roles() {
     return this.belongsToMany('App/Models/Role', 'user_id', 'role_id', 'id', 'id')
             .pivotTable('user_role_relations')
  }

  companies() {
    return this.belongsToMany('App/Models/Company', 'user_id', 'company_id', 'id', 'id')
      .pivotTable('user_role_relations');
  }

  async checkExercisePermissions(exercise, mode) {
    let hasPermissions = false;

    const exerciseCreatorCompanyId = exercise.company_id;
    const exerciseCreatorId = exercise.created_by;
    const userRolesAndCompanies = await Database.table('user_role_relations')
      .where('user_id', this.id);

    if (userRolesAndCompanies.length === 0) {
      return false;
    }

    if (mode === 'read') {
      // user admin can read anything
      console.log('input: exerciseCreatorId, exerciseCreatorCompanyId', 
        exerciseCreatorId, exerciseCreatorCompanyId, userRolesAndCompanies)
      userRolesAndCompanies.forEach((item) => { if (item.role_id === 6) hasPermissions = true });
      if (hasPermissions && mode === 'read') return true;

      // any role can see exercises of his company
      userRolesAndCompanies.forEach((item) => { 
        if (exercise.is_system_default || item.company_id === exerciseCreatorCompanyId) {
          hasPermissions = true;
        }
      });
    } else if (mode === 'write') {
      console.log('input: exerciseCreatorId, exerciseCreatorCompanyId', 
        exerciseCreatorId, exerciseCreatorCompanyId, userRolesAndCompanies)
      // admin (6), trainer (2) and client (1) can change 
      // and delete only their exercises in their company
      userRolesAndCompanies.forEach((item) => {
        if (exerciseCreatorId === item.user_id 
          && exerciseCreatorCompanyId === item.company_id
          && (item.role_id === 6 || item.role_id === 2 || item.role_id === 1)) {
          hasPermissions = true;
        }
      });

      // owner (3) and manager (4) can change their companies' exercises
      userRolesAndCompanies.forEach((item) => {
        if (exerciseCreatorCompanyId === item.company_id
          && (item.role_id === 3 || item.role_id === 4)) {
          hasPermissions = true;
        }
      });
    }

    return hasPermissions;
  }

  async checkWorkoutPermissions(workout, mode) {
    let hasPermissions = false;

    const workoutCreatorCompanyId = workout.company_id;
    const workoutCreatorId = workout.created_by;
    const userRolesAndCompanies = await Database.table('user_role_relations')
      .where('user_id', this.id);

    if (userRolesAndCompanies.length === 0) {
      return false;
    }

    if (mode === 'read') {
      // user admin can read anything
      console.log('input: workoutCreatorId, workoutCreatorCompanyId', 
        workoutCreatorId, workoutCreatorCompanyId, userRolesAndCompanies)
      userRolesAndCompanies.forEach((item) => { if (item.role_id === 6) hasPermissions = true });
      if (hasPermissions && mode === 'read') return true;

      // any role can see workouts of his company
      userRolesAndCompanies.forEach((item) => { 
        if (workout.is_system_default || item.company_id === workoutCreatorCompanyId) {
          hasPermissions = true;
        }
      });
    } else if (mode === 'write') {
      console.log('input: workoutCreatorId, workoutCreatorCompanyId', 
        workoutCreatorId, workoutCreatorCompanyId, userRolesAndCompanies)
      // admin (6), trainer (2) and client (1) can change 
      // and delete only their workouts in their company
      userRolesAndCompanies.forEach((item) => {
        if (workoutCreatorId === item.user_id 
          && workoutCreatorCompanyId === item.company_id
          && (item.role_id === 6 || item.role_id === 2 || item.role_id === 1)) {
          hasPermissions = true;
        }
      });

      // owner (3) and manager (4) can change their companies' workouts
      userRolesAndCompanies.forEach((item) => {
        if (workoutCreatorCompanyId === item.company_id
          && (item.role_id === 3 || item.role_id === 4)) {
          hasPermissions = true;
        }
      });
    }

    return hasPermissions;
  }

  async clientWithCompanies(companiesIds) {
    const data = await Database
    .table('user_role_relations')
    .where('user_id', this.id)
    .where('role_id', '=', 1)
    .whereIn('company_id', companiesIds)
    .count();
    
    return data;
  }

  async userCompaniesWithRoles(roleIds) {
    const records = await Database
      .table('user_role_relations')
      .whereRaw(
        'user_id = ? AND role_id between ? AND ?', 
        [this.id, roleIds[0], roleIds[1]]
    );

    return records.map((item) => item.company_id);
  }

  async hasPhysicalConditionsPermissions(mode, client) {
    let hasPermissions = false;

    // client is authorized person
    if (client.id === this.id) {
      hasPermissions = true;
      return hasPermissions;
    }

    // if admin and read mode
    const isAdmin = await this.isAdmin();

    if (mode === User.MODES[0] && isAdmin) {
      hasPermissions = true;
      return hasPermissions;
    }

    const userCompaniesIds = await this.userCompaniesWithRoles([2,4]);

    if (!userCompaniesIds || userCompaniesIds.length === 0) {
      return false;
    }

    const clientCompanies = await client.clientWithCompanies(userCompaniesIds);

    if (clientCompanies[0].count) {
      hasPermissions = true;
    }

    return hasPermissions;
  }

  async isAdmin() {
    const userIsAdmin = await Database
      .table('user_role_relations')
      .whereRaw('user_id = ? AND role_id = 6', [this.id]).count();
    
    return userIsAdmin[0].count != 0 ? true : false
  }

  physicalConditions() {
    return this.hasOne('App/Models/PhysicalCondition', 'user_id', 'id');
  }
  
  async getRolesWithCompanies() {
      const roles = await Database.table('user_role_relations')
              .leftJoin('roles', 'user_role_relations.role_id', 'roles.id')
              .where('user_role_relations.user_id', '=', this.id)
              .select(['user_role_relations.id', 'user_id', 'role_id', 'company_id', 'roles.name']);
      return roles;
  }
  
  async getWorkedCompanyList() {
      let companies = null;
      companies = await Database.table('user_role_relations')
              .where('user_id', '=', this.id)
              .where('role_id', '<>', 1);
      let out = [];
      companies.forEach(function(element) {
          if(out.indexOf(element.company_id) === -1) {
                  out.push(element.company_id);
          }
      });
      return out;
  }
  
  async isClient() {
      let result = await Database.table('user_role_relations')
              .where('user_id', '=', this.id)
              .where('role_id', '=', 1).count();
      if(parseInt(result[0].count) > 0) {
          return this.id;
      }
      else {
          return null;
      }
  }
  
  async isInMyCompany(user_id) {
      let list = await this.getWorkedCompanyList();
      let result = await Database.table('user_role_relations')
              .where('user_id', '=', user_id)
              .whereIn('company_id', list)
              .where('role_id', '=', 1)
              .count();
      if(parseInt(result[0].count) === 0) {user_id = null;}
      return user_id;
  }
  
  async isTrainersClient(user_id) {
      let result = await Database.table('trainer_client_relations')
              .where('client_id', '=', user_id)
              .where('trainer_id', this.id)
              .count();
      if(parseInt(result[0].count) === 0) {user_id = null;}
      return user_id;
  }
  
  async checkForecastPermissions(forecast, mode) {
    let hasPermissions = false;

    // forecasts
    const forecastCreatorCompanyId = forecast.company_id;
    
    const forecastCreatorId = forecast.created_by;
    const userRolesAndCompanies = await Database.table('user_role_relations')
      .where('user_id', this.id);

    if (userRolesAndCompanies.length === 0) {
      return false;
    }
  
    if (mode === 'read') {
      // user admin can read anything
      console.log('input: forecastCreatorId, forecastCreatorCompanyId', 
        forecastCreatorId, forecastCreatorCompanyId, userRolesAndCompanies)
      userRolesAndCompanies.forEach((item) => { if (item.role_id === 6) hasPermissions = true });
      if (hasPermissions) return true;

      // any role can see forecasts of his company
      userRolesAndCompanies.forEach((item) => { 
        if (forecast.is_system_default || item.company_id === forecastCreatorCompanyId) {
          hasPermissions = true;
        }
      });
    } else if (mode === 'write') {
      console.log('input: forecastCreatorId, forecastCreatorCompanyId', 
        forecastCreatorId, forecastCreatorCompanyId, userRolesAndCompanies)
      // admin (6), trainer (2) and client (1) can change 
      // and delete only their forecasts in their company
      userRolesAndCompanies.forEach((item) => {
        if (forecastCreatorId === item.user_id 
          && forecastCreatorCompanyId === item.company_id
          && (item.role_id === 6 || item.role_id === 2 || item.role_id === 1)) {
          hasPermissions = true;
        }
      });

      // owner (3) and manager (4) can change their companies' forecasts
      userRolesAndCompanies.forEach((item) => {
        if (forecastCreatorCompanyId === item.company_id
          && (item.role_id === 3 || item.role_id === 4)) {
          hasPermissions = true;
        }
      });
    }

    return hasPermissions;
  }

  async checkProgramPermissions(program, mode) {
    let hasPermissions = false;

    // programs
    const programCreatorCompanyId = program.company_id;
    
    const programCreatorId = program.created_by;
    const userRolesAndCompanies = await Database.table('user_role_relations')
      .where('user_id', this.id);

    if (userRolesAndCompanies.length === 0) {
      return false;
    }

    if (mode === 'read') {
      // user admin can read anything
      console.log('input: programCreatorId, programCreatorCompanyId', 
        programCreatorId, programCreatorCompanyId, userRolesAndCompanies)
      userRolesAndCompanies.forEach((item) => { if (item.role_id === 6) hasPermissions = true });
      if (hasPermissions && mode === 'read') return true;

      // any role can see programs of his company
      userRolesAndCompanies.forEach((item) => { 
        if (program.is_system_default || item.company_id === programCreatorCompanyId) {
          hasPermissions = true;
        }
      });
    } else if (mode === 'write') {
      console.log('input: programCreatorId, programCreatorCompanyId', 
        programCreatorId, programCreatorCompanyId, userRolesAndCompanies)
      // admin (6), trainer (2) and client (1) can change 
      // and delete only their programs in their company
      userRolesAndCompanies.forEach((item) => {
        if (programCreatorId === item.user_id 
          && programCreatorCompanyId === item.company_id
          && (item.role_id === 6 || item.role_id === 2 || item.role_id === 1)) {
          hasPermissions = true;
        }
      });

      // owner (3) and manager (4) can change their companies' programs
      userRolesAndCompanies.forEach((item) => {
        if (programCreatorCompanyId === item.company_id
          && (item.role_id === 3 || item.role_id === 4)) {
          hasPermissions = true;
        }
      });
    }

    return hasPermissions;
  }

  async permissionsChecker (modelInstance, mode) {
    let hasPermissions = false;

    // programs
    const instanceCreatorCompanyId = modelInstance.company_id;
    
    const instanceCreatorId = modelInstance.created_by;
    const userRolesAndCompanies = await Database.table('user_role_relations')
      .where('user_id', this.id);

    if (userRolesAndCompanies.length === 0) {
      return false;
    }
  
    if (mode === 'read') {
      // user admin can read anything
      userRolesAndCompanies.forEach((item) => { if (item.role_id === 6) hasPermissions = true });
      if (hasPermissions) return true;

      // any role can see smth of his company (except for phys conditions)
      userRolesAndCompanies.forEach((item) => { 
        if (modelInstance.is_system_default || item.company_id === instanceCreatorCompanyId) {
          hasPermissions = true;
        }
      });
    } else if (mode === 'write') {
      // admin (6), trainer (2) and client (1) can change 
      // and delete only their programs in their company
      userRolesAndCompanies.forEach((item) => {
        if (instanceCreatorId === item.user_id 
          && programCreatorCompanyId === item.company_id
          && (item.role_id === 6 || item.role_id === 2 || item.role_id === 1)) {
          hasPermissions = true;
        }
      });

      // owner (3) and manager (4) can change their companies' programs
      userRolesAndCompanies.forEach((item) => {
        if (instanceCreatorCompanyId === item.company_id
          && (item.role_id === 3 || item.role_id === 4)) {
          hasPermissions = true;
        }
      });
    }

    return hasPermissions;
  }

  async checkCompanyPermissions(company_id) {
    const data = await Database.raw(`
      select count(*) 
      from user_role_relations
      where user_id = ${this.id} AND company_id = ${company_id}`
    );

    return data.rows[0].count !== '0' ? true : false;
  }
}

module.exports = User;
