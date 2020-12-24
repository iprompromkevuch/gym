'use strict'
const Image = use('App/Models/Image');
const Helpers = use('Helpers');
const Drive = use('Drive');

class ImageController {
  /**
  * @swagger
  * /api/v1/image:
  *   post:
  *     tags:
  *       - Image API
  *     summary: Add new image
  *     security:
  *       - bearerAuth: []
  *     consumes:
  *       - multipart/form-data
  *     parameters:
  *       - name: user_id
  *         description: ID of the user to add image
  *         in: formData
  *         required: false
  *         type: string
  *       - name: image
  *         description: User's avatar
  *         in: formData
  *         required: false
  *         type: file
  *     responses:
  *       200:
  *         description: Create image Ok
  *         example:
  *           response: {
                "user_id": 4,
                "url": "/uploads/user/4/curious.png",
                "created_at": "2020-09-18 16:59:49",
                "updated_at": "2020-09-18 16:59:49",
                "id": 7
               }
  *       424:
  *         description: Validation failed
  *         example:
  *           response: {"message": "Error during file copying"}
  */
    async createImage({request, auth, response}) {
      const data = request.only(['user_id']);
      let id_user = null;
      if(data.user_id === undefined || data.user_id === null) {
          id_user = await auth.user.isClient();
      }
      else {
          id_user = await auth.user.isInMyCompany(data.user_id);
          if(id_user === null) {
              id_user = await auth.user.isTrainersClient(data.user_id);
          }
      }
      if (id_user === null) {
          return response.status(403).json({message: 'Forbidden'});
      }
      let url = null;
      const profilePic = request.file('image', {
        types: ['image'],
        size: '2mb'
      });
      if(profilePic != null) {
          await profilePic.move(Helpers.tmpPath('uploads/user/' + id_user), {
            overwrite: true
          });
          if (profilePic.moved()) {
            url = '/uploads/user/' + id_user + '/' + profilePic.clientName;
          }
      }
      if (url === null) {
          return response.status(424).json({message: 'Error during file copying'});
      }
      const imgInfo = {
          user_id: id_user,
          url: url
      }
      let image = await Image.create(imgInfo);
      return response.json(image);
    }
    
  /**
  * @swagger
  * /api/v1/image/{id}:
  *   get:
  *     tags:
  *       - Image API
  *     security:
  *          - bearerAuth: []
  *     summary: Get specified image
  *     parameters:
  *       - name:  id
  *         description: Image id, must be integer
  *         in: path
  *         required: true
  *     responses:
  *       200:
  *         description: Get image
  *         example:
  *           response: {
                "user_id": 4,
                "url": "/uploads/user/4/curious.png",
                "created_at": "2020-09-18 16:59:49",
                "updated_at": "2020-09-18 16:59:49",
                "id": 7
              }
  *       404:
  *         description: Image not found
  *         example:
  *           response: {
                  "message": "Not Found"
              }
  *       403:
  *         description: Forbidden to see image
  *         example:
  *           response: {
                  "message": "Forbidden"
              }
  */
    async getImage({params, auth, response}) {
        let image = await Image.find(params.id);
        if(image === null) {
            return response.status(404).json({message: 'Not Found'});
        }
        let allowed = null;
        if(auth.user.id === image.user_id || auth.user.is_admin === true) {
            allowed = true;
        }
        else {
            allowed = await auth.user.isInMyCompany(image.user_id);
            if (allowed === null) {
               allowed = await auth.user.isTrainersClient(image.user_id);
            }
        }
        if (allowed === null) {
            return response.status(403).json({message: 'Forbidden'});
        }
        return response.json(image);
    }
    
    
  /**
  * @swagger
  * /api/v1/images/{id}:
  *   get:
  *     tags:
  *       - Image API
  *     security:
  *          - bearerAuth: []
  *     summary: Get list of user's images
  *     parameters:
  *       - name: id
  *         description: Id of user to get images
  *         in: path
  *         required: true
  *         type: number
  *       - name: page
  *         description: Number of the current page (used for pagination)
  *         in: query
  *         required: false
  *         type: string
  *       - name: quantity
  *         description: Number of users, displayed pre page (used for pagination)
  *         in: query
  *         required: false
  *         type: string
  *     responses:
  *       200:
  *         description: Collection of user's images
  *         example:
  *           response: {
                    "total": "2",
                    "perPage": 2147483640,
                    "page": 1,
                    "lastPage": 1,
                    "data": [
                      {
                        "id": 1,
                        "user_id": 4,
                        "url": null,
                        "created_at": "2020-09-14 17:59:58",
                        "updated_at": "2020-09-14 17:59:58"
                      },
                      {
                        "id": 7,
                        "user_id": 4,
                        "url": "/uploads/user/4/curious.png",
                        "created_at": "2020-09-18 16:59:49",
                        "updated_at": "2020-09-18 16:59:49"
                      }
                    ]
                  }
  */
    async userImages({params, request, auth, response}) {
        let allowed = null;
        if(auth.user.id == params.id || auth.user.is_admin === true) {
            allowed = true;
        }
        else {
            allowed = await auth.user.isInMyCompany(params.id);
            if (allowed === null) {
               allowed = await auth.user.isTrainersClient(params.id);
            }
        }
        if (allowed === null) {
            return response.status(403).json({message: 'Forbidden'});
        }
        const data = request.only(['page', 'quantity']);
        let quantity = 2147483640;
        let page = 1;
        if(data.page !== undefined && data.page !== null) {
            page = parseInt(data.page);
        }
        if(data.quantity !== undefined && data.quantity !== null) {
            quantity = parseInt(data.quantity);
        }
        let images = await Image.query().where('user_id', '=', params.id).paginate(page, quantity);
        return response.json(images);
    }
    
    /**
  * @swagger
  * /api/v1/image/{id}:
  *   delete:
  *     tags:
  *       - Image API
  *     security:
  *          - bearerAuth: []
  *     summary: Delete specified image
  *     parameters:
  *       - name:  id
  *         description: Image id, must be integer.
  *         in: path
  *         required: true
  *     responses:
  *       200:
  *         description: Delete Ok
  *         example:
  *           response: {
                "message": "Done"
              }
  *       404:
  *         description: Image not found
  *         example:
  *           response: {
                  "message": "Not Found"
              }
  *       403:
  *         description: Image not found
  *         example:
  *           response: {
                  "message": "Forbidden"
              }
  */
    async destroyImage({params, auth, response}) {
        let image = await Image.find(params.id);
        if(image === null) {
            return response.status(404).json({message: 'Not Found'});
        }
        let allowed = null;
        if(auth.user.id === image.user_id || auth.user.is_admin === true) {
            allowed = true;
        }
        else {
            allowed = await auth.user.isInMyCompany(image.user_id);
            if (allowed === null) {
               allowed = await auth.user.isTrainersClient(image.user_id);
            }
        }
        if (allowed === null) {
            return response.status(403).json({message: 'Forbidden'});
        }
        let done = await Drive.delete(image.url.replace('/uploads', 'uploads'));
        if(done === true) {
            await image.delete();
            return response.json({message: 'Done'})
        }  
    }
    
    /**
  * @swagger
  * /api/v1/image/{id}:
  *   put:
  *     tags:
  *       - Image API
  *     summary: Edit image
  *     security:
  *       - bearerAuth: []
  *     consumes:
  *       - multipart/form-data
  *     parameters:
  *       - name: id
  *         description: ID of the image
  *         in: path
  *         required: true
  *         type: string
  *       - name: image
  *         description: User's avatar
  *         in: formData
  *         required: false
  *         type: file
  *     responses:
  *       200:
  *         description: Edit Ok
  *         example:
  *           response: {
                "message": "Done"
               }
  *       424:
  *         description: Can't copy image
  *         example:
  *           response: {"message": "Error during file copying"}
  *       404:
  *         description: Image not found
  *         example:
  *           response: {
                  "message": "Not Found"
              }
  *       403:
  *         description: Have no permissions to edit image
  *         example:
  *           response: {
                  "message": "Forbidden"
              }
  */
    async editImage({params, request, auth, response}) {
        let image = await Image.find(params.id);
        if(image === null) {
            return response.status(404).json({message: 'Not Found'});
        }
        let allowed = null;
        if(auth.user.id === image.user_id || auth.user.is_admin === true) {
            allowed = true;
        }
        else {
            allowed = await auth.user.isInMyCompany(image.user_id);
            if (allowed === null) {
               allowed = await auth.user.isTrainersClient(image.user_id);
            }
        }
        if (allowed === null) {
            return response.status(403).json({message: 'Forbidden'});
        }
        
        await Drive.delete(image.url.replace('/uploads', 'uploads'));
        let url = null;
        const profilePic = request.file('image', {
          types: ['image'],
          size: '2mb'
        });
        if(profilePic != null) {
            await profilePic.move(Helpers.tmpPath('uploads/user/' + image.user_id), {
              overwrite: true
            });
            if (profilePic.moved()) {
              url = '/uploads/user/' + image.user_id + '/' + profilePic.clientName;
            }
        }
        if (url === null) {
            return response.status(424).json({message: 'Error during file copying'});
        }
        image.url = url;
        await image.save();
        return response.json({message: 'Done'});
    }
}

module.exports = ImageController
