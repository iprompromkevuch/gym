# Adonis fullstack application
required node version ```14+```

This is the fullstack boilerplate for AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Session
3. Authentication
4. Web security middleware
5. CORS
6. Edge template engine
7. Lucid ORM
8. Migrations and seeds

## Setup

Use the adonis command to install the blueprint

```bash
adonis new yardstick
```

or manually clone the repo and then run `npm install`.


### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```

### Run docker
1. In main directory run ```sudo docker-compose up```

If you want to use db manually -> ```sudo docker exec -it CONTAINER_ID bash```
```su postgres```, 
