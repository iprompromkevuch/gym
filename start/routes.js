'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Helpers = use('Helpers')
Route.on('/').render('welcome')

Route.get('/uploads/user/:uid/:file', async({response,params})=>{
    return response.download(Helpers.tmpPath(`/uploads/user/${params.uid}/${params.file}`))
   
});

Route.group(() => {
    // register, login
    Route.post('/user', 'UserController.register').validator('Register');
    Route.post('/login', 'UserController.login').validator('Login');
    Route.post('/user/client', 'UserController.createClient').validator('CreateUserClient');
    
    // user
    Route.put('/user/assign_role/:id', 'UserController.assignRole').middleware(['auth']);
    Route.get('/user/me', 'UserController.me').middleware(['auth']);
    Route.get('/user', 'UserController.listUsers').middleware(['auth']);
    Route.get('/user/:id', 'UserController.viewUser').middleware(['auth']);
    Route.put('/user/:id', 'UserController.editUser').middleware(['auth']).validator('EditUser');

    // company
    Route.get('/company', 'CompanyController.listCompanies').middleware(['auth']);
    Route.get('/company/:id', 'CompanyController.getCompany').middleware(['auth']);
    Route.put('/company/:id', 'CompanyController.editCompany').middleware(['auth']).validator('EditCompany');
    Route.post('/company', 'CompanyController.createCompany').middleware(['auth']).validator('CreateCompany');
    
    // gym
    Route.post('/gym', 'GymController.createGym').middleware(['auth']).validator('CreateGym');
    Route.get('/gym/:id', 'GymController.getGym').middleware(['auth']);
    Route.put('/gym/:id', 'GymController.editGym').middleware(['auth']).validator('EditGym');
    
    // image
    Route.post('/image/', 'ImageController.createImage').middleware(['auth']);
    Route.get('/image/:id', 'ImageController.getImage').middleware(['auth']);
    Route.get('/images/:id', 'ImageController.userImages').middleware(['auth']);
    Route.delete('/image/:id', 'ImageController.destroyImage').middleware(['auth']);
    Route.put('/image/:id', 'ImageController.editImage').middleware(['auth']);

    // physical conditions
    // main
    Route.get('/physical-condition/:id', 'PhysicalConditionController.show')
        .middleware(['auth']);
    Route.get('/physical-condition/list/:id', 'PhysicalConditionController.list')
        .middleware(['auth']);
    Route.post('/physical-condition', 'PhysicalConditionController.create')
        .middleware(['auth']).validator('CreatePhysicalCondition');
    Route.put('/physical-condition/:id', 'PhysicalConditionController.change')
        .middleware(['auth']).validator('ChangePhysicalCondition');
    
    // calculations
    Route.post('/physical-condition/calculate', 'PhysicalConditionController.calculate')
        .middleware(['auth']).validator('CalculatePhysicalCondition');
    
    // exercises
    // main
    Route.get('/exercise/:id', 'ExerciseController.show').middleware(['auth']);
    Route.get('/exercise/list/available', 'ExerciseController.showAllAvailable')
        .middleware(['auth']).validator('AnyList');
    Route.post('/exercise/list/filter', 'ExerciseController.listFiltered')
        .middleware(['auth']).validator('ExerciseGetAvailableWithRestrictions');
    Route.post('/exercise', 'ExerciseController.create')
        .middleware(['auth']).validator('CreateExercise');
    Route.put('/exercise/:id', 'ExerciseController.change')
        .middleware(['auth']).validator('ChangeExercise');
    Route.delete('/exercise/:id', 'ExerciseController.delete')
        .middleware(['auth']);
        
    // assign to workout
    Route.post('/exercise/assign', 'ExerciseController.assignToWorkout')
        .middleware(['auth']).validator('AssignExercise');
    Route.delete('/exercise/assign/delete', 'ExerciseController.deleteAssignment')
        .middleware(['auth']).validator('AssignExercise');

    // favorite
    Route.post('/exercise/favorite', 'FavoriteExercisesController.create')
        .middleware(['auth']).validator('CreateExerciseFavorite');
    Route.delete('/exercise/favorite/:id', 'FavoriteExercisesController.delete')
        .middleware(['auth']);

    // groups of exercises that belong to workout
    Route.get('/exercise/group/:id', 'ExerciseGroupController.show').middleware(['auth']);
    Route.post('/exercise/group', 'ExerciseGroupController.create')
        .middleware(['auth']).validator('CreateExerciseGroup');
    Route.delete('/exercise/group/:id', 'ExerciseGroupController.delete')
        .middleware(['auth']);
    Route.post('/exercise/group/item', 'ExerciseGroupController.addToGroup')
        .middleware(['auth']).validator('CreateExerciseGroupItem');
    Route.delete('/exercise/group/delete/item/:id', 'ExerciseGroupController.deleteItem')
        .middleware(['auth']);
    Route.put('/exercise/group/:id/order', 'ExerciseGroupController.changeExerciseOrder')
        .middleware(['auth']).validator('ChangeExerciseOrder');

    // workout
    // main
    Route.get('/workout/:id', 'WorkoutController.show')
        .middleware(['auth']);
    Route.get('/workout', 'WorkoutController.list')
        .middleware(['auth']).validator('AnyList');
    Route.put('/workout/:id', 'WorkoutController.change')
        .middleware(['auth']).validator('ChangeWorkout');
    Route.post('/workout', 'WorkoutController.create')
        .middleware(['auth']).validator('CreateWorkout');
    Route.post('/workout/search/filter', 'WorkoutController.search')
        .middleware(['auth']).validator('Filter');
    Route.delete('/workout/:id', 'WorkoutController.delete')
        .middleware(['auth']);
    
    // assign to program
    Route.post('/workout/assign', 'WorkoutController.assignToProgram')
        .middleware(['auth']).validator('AssignWorkout');
    Route.delete('/workout/assign/delete', 'WorkoutController.deleteAssignment')
        .middleware(['auth']).validator('AssignWorkout');

    // groups
    Route.put('/workout/:id/group/order', 'WorkoutController.groupOrder')
        .middleware(['auth']).validator('ChangeWorkoutGroupOrder');

    // favorite
    Route.post('/workout/favorite', 'WorkoutController.addToFavorite')
        .middleware(['auth']).validator('CreateFavoriteWorkout');
    Route.delete('/workout/favorite/:id', 'WorkoutController.deleteFavorite')
        .middleware(['auth']);

    // forecasts
    // main
    Route.get('/forecast/:id', 'ForecastController.show')
        .middleware(['auth']);
    Route.get('/forecast', 'ForecastController.list')
        .middleware(['auth']).validator('AnyList');
    Route.put('/forecast/:id', 'ForecastController.change')
        .middleware(['auth']).validator('ChangeForecast');
    Route.post('/forecast', 'ForecastController.create')
        .middleware(['auth']).validator('CreateForecast');
    Route.delete('/forecast/:id', 'ForecastController.delete')
        .middleware(['auth']);
    
    // assign to program
    Route.post('/forecast/assign', 'ForecastController.assignToProgram')
        .middleware(['auth']).validator('AssignForecast');
    Route.post('/forecast/delete-assign', 'ForecastController.deleteAssignToProgram')
        .middleware(['auth']).validator('DeleteAssignForecast');

    // program
    // main
    Route.get('/program/:id', 'ProgramController.show')
        .middleware(['auth']);
    Route.get('/program', 'ProgramController.list')
        .middleware(['auth']).validator('AnyList');
    Route.put('/program/:id', 'ProgramController.change')
        .middleware(['auth']).validator('ChangeProgram');
    Route.post('/program', 'ProgramController.create')
        .middleware(['auth']).validator('CreateProgram');
    Route.delete('/program/:id', 'ProgramController.delete')
        .middleware(['auth']);
    Route.post('/program/assign', 'ProgramController.assign')
        .middleware(['auth']).validator('AssignProgram');
    Route.delete('/program/assign/:program_id', 'ProgramController.unAssign')
        .middleware(['auth']).validator('UnAssignProgram');
    Route.get('/program/search/filter', 'ProgramController.listFiltered')
        .middleware(['auth']).validator('FilterProgram');

    // phase
    // Route.get('/phase/:id', 'PhaseController.show')
    // .middleware(['auth']);
    Route.post('/phase', 'PhaseController.create')
        .middleware(['auth']).validator('CreatePhase');

    // muscles
    // .middleware(['auth']);
    Route.get('/muscle', 'MuscleController.list').middleware(['auth']);
}).prefix('api/v1');




