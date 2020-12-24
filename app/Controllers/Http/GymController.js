'use strict'
const Company = use('App/Models/Company');
const Gym = use('App/Models/Gym');
const Database = use('Database');

class GymController {
  /**
  * @swagger
  * /api/v1/gym:
  *   post:
  *     tags:
  *       - Gym API
  *     summary: Create new gym. Only company owner can use this api
  *     security:
  *          - bearerAuth: []
  *     parameters:
  *       - name: name
  *         description: Gym name, must be maximum 200 characters long.
  *         in: query
  *         required: true
  *         type: string
  *       - name: description
  *         description: Gym description.
  *         in: query
  *         required: false
  *         type: string
  *       - name: email
  *         description: Gym email. must be email, if set. Maximum 150 characters long
  *         in: query
  *         required: true
  *         type: string
  *       - name: phone
  *         description: Gym's phone number. Must not more than 20 characters long
  *         in: query
  *         required: true
  *         type: string
  *       - name: state
  *         description: State, maximum 50 characters
  *         in: query
  *         required: true
  *         type: string
  *       - name: city
  *         description: City, maximum 255 characters
  *         in: query
  *         required: true
  *         type: string
  *       - name: zip
  *         description: Zip code. must be at maximum 50 characters long.
  *         in: query
  *         required: true
  *         type: string
  *       - name: address_line1
  *         description: Addres line 1, no limits
  *         in: query
  *         required: true
  *         type: string
  *       - name: address_line2
  *         description: Addres line 2, no limits
  *         in: query
  *         required: false
  *         type: string
  *       - name: work_hours
  *         description: Array of work hours example of keys - work_hours[su], work_hours[mo], work_hours[etc] etc ...
  *         in: query
  *         required: false
  *         type: array
  *         collectionFormat: multi
  *         items:
  *           type: string
  *       - name: payment_details
  *         description: Array of payment details, hidden value, visible only for company owner example of keys - payment_details[bank], payment_details[card], payment_details[etc] etc ...
  *         in: query
  *         required: false
  *         type: array
  *         collectionFormat: multi
  *         items:
  *           type: string
  *       - name: company_id
  *         description: Company that owns this gym
  *         in: query
  *         required: true
  *         type: integer
  *       - name: status
  *         description: Status
  *         in: query
  *         required: true
  *         type: integer
  *     responses:
  *       200:
  *         description: Gym created successfully
  *         example:
  *           response: {
                "name": "Test 12",
                "description": "Lorem Ipsum",
                "phone": "+0000000001",
                "email": "mail@mail.arz",
                "city": "City-17",
                "state": "State-11",
                "address_line1": "gbbio ubib b ubibb iiuiiohh",
                "address_line2": "gseg t gg wg hhdthrhr",
                "zip": "8547963",
                "work_hours": "{\"su\":\"9 - 18\",\"mo\":\"9 - 18\",\"tu\":\"10 - 15\",\"we\":\"10-15\",\"th\":\"9 - 18\",\"fr\":\"9 - 18\",\"sa\":\"9 - 15\"}",
                "company_id": "15",
                "status": "1",
                "created_at": "2020-09-11 14:33:56",
                "updated_at": "2020-09-11 14:33:56",
                "id": 6,
                "payment": "{\"bank\":\"Bank\",\"card\":\"0000 0000 0000 0000\"}"
          }
  *       422:
  *         description: Validation failed
  *         example:
  *           response: {
            "errors": [
                {
                    "title": "email",
                    "detail": "email validation failed on email",
                    "source": {
                        "pointer": "email"
                    }
                }
            ]
        }
  *       403:
  *         description: Entered company_id of the company that doesn't belong to current user
  *         example:
  *           response: {"message": "Forbidden"}
  */
    async createGym({request, auth, response}) {
        const data = request.only(['name', 'description', 'phone', 'email', 'city', 
        'state', 'address_line1', 'address_line2', 'zip', 'work_hours', 'payment_details',
        'company_id', 'status']);
        let allowed = await Gym.allowedCreate(auth.user.id, data.company_id)
        if(!allowed) {
            return response.status(403).json({message: 'Forbidden'});
        }
        let workhours = null;
        console.log(typeof data.work_hours);
        if(data.work_hours !== undefined && data.work_hours !== null && (typeof data.work_hours === 'object' || typeof data.work_hours === 'array')) {
            workhours = JSON.stringify(data.work_hours);
        }
        let payment = null;
        if(data.payment_details !== undefined && data.payment_details !== null && typeof data.payment_details === 'object') {
            payment = JSON.stringify(data.payment_details);
        }
        
        const gymData = {
            name: data.name,
            description: data.description,
            phone: data.phone,
            email: data.email,
            city: data.city,
            state: data.state,
            address_line1: data.address_line1,
            address_line2: data.address_line2,
            zip: data.zip,
            work_hours: workhours,
            payment_details: payment,
            company_id: data.company_id,
            status: data.status
        }
        let newGym = await Gym.create(gymData);
        const hiddenDetails = {payment: newGym.payment_details};
        Object.assign(newGym, hiddenDetails);
        return response.json(newGym);
        
    }
    
 /**
  * @swagger
  * /api/v1/gym/{id}:
  *   get:
  *     tags:
  *       - Gym API
  *     security:
  *          - bearerAuth: []
  *     summary: Get info about specified gym
  *     parameters:
  *       - name:  id
  *         description: Gym id, must be integer.
  *         in: path
  *         required: true   
  *     responses:
  *       200:
  *         description: Gym info
  *         example:
  *           response: {
                "id": 2,
                "name": "I want to test",
                "description": "gregrebrerreb ebrebebe ebrbeb",
                "phone": "+111111111",
                "email": "mail@mail.ra",
                "city": "Gmerinka",
                "state": "OR",
                "address_line1": "Lorem ipsum",
                "address_line2": "wdfr3",
                "zip": "1234567890",
                "work_hours": {
                    "su": "9 - 20",
                    "mo": "9 - 20",
                    "tu": "9 - 20",
                    "we": "9 - 20",
                    "th": "9 - 20",
                    "fr": "9 - 20",
                    "sa": "9 - 19"
                },
                "company_id": 15,
                "status": 2,
                "created_at": "2020-09-10 00:33:10",
                "updated_at": "2020-09-10 17:18:57",
                "payment": {
                    "bank": "ABC bank",
                    "card": "1234567890101112"
                } 
              }
  *       404:
  *         description: Company not found
  *         example:
  *           response: {
                  "message": "Not Found"
              }
  */
    async getGym({params, auth, response}) {
        let gym = await Gym.find(params.id);
        if (gym === null) {
            return response.status(404).json({message: 'Not Found'});
        }
        let company = await gym.company().fetch();
        let seeDetails = await Database.from('user_role_relations')
                .where('role_id', '=', 3)
                .where('company_id', '=', company.id)
                .where('user_id', '=', auth.user.id).count();
        if(seeDetails[0].count > 0) {
            const hiddenDetails = {payment: gym.payment_details};
            Object.assign(gym, hiddenDetails);
        }
        return response.json(gym);
    }
    
    
      /**
  * @swagger
  * /api/v1/gym/{id}:
  *   put:
  *     tags:
  *       - Gym API
  *     summary: Edit specific gym. Only company owner can use this api. Note if parameter isn't set this parameter won't be updated
  *     security:
  *          - bearerAuth: []
  *     parameters:
  *       - name:  id
  *         description: Gym id, must be integer
  *         in: path
  *         required: true  
  *       - name: name
  *         description: Gym name, must be maximum 200 characters long.
  *         in: query
  *         required: false
  *         type: string
  *       - name: description
  *         description: Gym description.
  *         in: query
  *         required: false
  *         type: string
  *       - name: email
  *         description: Gym email. must be email, if set. Maximum 150 characters long
  *         in: query
  *         required: false
  *         type: string
  *       - name: phone
  *         description: Gym's phone number. Must not more than 20 characters long
  *         in: query
  *         required: false
  *         type: string
  *       - name: state
  *         description: State, maximum 50 characters
  *         in: query
  *         required: false
  *         type: string
  *       - name: city
  *         description: City, maximum 255 characters
  *         in: query
  *         required: false
  *         type: string
  *       - name: zip
  *         description: Zip code. must be at maximum 50 characters long.
  *         in: query
  *         required: false
  *         type: string
  *       - name: address_line1
  *         description: Addres line 1, no limits
  *         in: query
  *         required: false
  *         type: string
  *       - name: address_line2
  *         description: Addres line 2, no limits
  *         in: query
  *         required: false
  *         type: string
  *       - name: work_hours
  *         description: Array of work hours example of keys - work_hours[su], work_hours[mo], work_hours[etc] etc ...
  *         in: query
  *         required: false
  *         type: array
  *         collectionFormat: multi
  *         items:
  *           type: string
  *       - name: payment_details
  *         description: Array of payment details, hidden value, visible only for company owner example of keys - payment_details[bank], payment_details[card], payment_details[etc] etc ...
  *         in: query
  *         required: false
  *         type: array
  *         collectionFormat: multi
  *         items:
  *           type: string
  *       - name: company_id
  *         description: Company that owns this gym
  *         in: query
  *         required: true
  *         type: integer
  *       - name: status
  *         description: Status
  *         in: query
  *         required: false
  *         type: integer
  *     responses:
  *       200:
  *         description: Gym edited successfully
  *         example:
  *           response: {
                "message": "Done"
              }
  *       422:
  *         description: Validation failed
  *         example:
  *           response: {
            "errors": [
                {
                    "title": "email",
                    "detail": "email validation failed on email",
                    "source": {
                        "pointer": "email"
                    }
                }
            ]
        }
  *       403:
  *         description: Current user doesn't have permissions to edit this gym
  *         example:
  *           response: {"message": "Forbidden"}
  *       404:
  *         description: Gym not found
  *         example:
  *           response: {"message": "Not Found"}
  */
    async editGym({params, request, auth, response}) {
        let gym = await Gym.find(params.id);
        if(gym === null) {
            return response.status(404).json({message: 'Not Found'});
        }
        let allowed = await gym.allowedEdit(auth.user.id);
        if (!allowed) {
            return response.status(403).json({message: 'Forbidden'});
        }
        const data = request.only(['name', 'description', 'phone', 'email', 'city', 
        'state', 'address_line1', 'address_line2', 'zip', 'work_hours', 'payment_details',
        'company_id', 'status']);
        for (var property in data) {
           gym.setProperty(property, data[property]);
        }
        if(typeof data.work_hours === 'object') {
            gym.work_hours = JSON.stringify(data.work_hours);
        }
        if(typeof data.payment_details === 'object') {
            gym.payment_details = JSON.stringify(data.payment_details);
        }
        await gym.setCompany(data.company_id, auth.user.id)
        await gym.save();
        return response.json({message: 'Done'});
    }
}

module.exports = GymController
