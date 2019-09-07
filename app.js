// Pas sûr que ce soit encore nécessaire
require('babel-register')

// Custom FUNC
const {success, error, checkAndChange} = require('./assets/functions')


const express = require('express')
// Initier une instance de express
const app = express()

// MORGAN : module middleware qui log toutes les requetes HTTP dans la console
const morgan = require('morgan')('dev')
app.use(morgan)
// body-parser : middleware pour lire le contenu (body) des requestes post
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Fichier config
const config = require('./assets/config')

// Pour générer fichier documentation SWAGER
// ON FAIT CA DE FACON PROVISOIRE POUR GENERER LE FICHIER swagger.json
// PUIS ON UNINSTALL ET ON REMOVE TOUT CE QUI SUIT CI APRES
//const expressOasGenerator = require('express-oas-generator')
//expressOasGenerator.init(app, {})

// Ci après, le vrai swagger
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./assets/swagger.json')

app.use(config.rootAPI + '/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// MYSQL
const mysql = require('promise-mysql')
const db = mysql.createConnection({
  host: config.db.host,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password
}).then((db) => {

  console.log('Connected')

  // EXPRESS COMMENCE ICI, UNE FOIS QUE DB CONNECTED

  // ROUTEUR EXPRESS
  // Ca save l'url (au lieu de la remettre a chaque get,put, etc.)
  let MembersRouter = express.Router()
  let Members = require('./assets/classes/members-class')(db, config)

  MembersRouter.route('/:id')

    // GET membre par son ID
    .get(async (req, res) => {
      let member = await Members.getByID(req.params.id)
      res.json(checkAndChange(member))
    })

    .put(async (req, res) => {
      let result = await Members.update(req.params.id, req.body.name)
      res.json(checkAndChange(result))
   })

   .delete(async (req, res) => {
      let deleteMember = await Members.delete(req.params.id)
      res.json(checkAndChange(deleteMember))
   })

    // Recuperer tous les membres
    MembersRouter.route('/')

    // GET all les membres
    .get(async (req, res) => {
      let allMembers = await Members.getAll(req.query.max)
      res.json(checkAndChange(allMembers))
    })

    // ADD un membre par nom
    .post(async (req, res) => {
      if(req.body.name) {
        let adMember = await Members.add(req.body.name)
        res.json(checkAndChange(adMember))
      }
    })

  // Routeur EXPRESS
  app.use(config.rootAPI, MembersRouter)

  // Lancer l'app express sur port 8080 (ou autre en fonction de config.json)
  app.listen(config.port, () => console.log('app launched port ', config.port))

}).catch((err) => {
  console.log('Error during database connection')
  console.log(err.message)
})
