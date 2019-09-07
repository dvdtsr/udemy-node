// Modules
require('babel-register')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')('dev')
const twig = require('twig')
const axios = require('axios');

// Global var
const app = express()
const port = 8081
const fetch = axios.create({
  baseURL: 'http://localhost:8080/api/v1'
});

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan)

// Routes

// page d'accueil
app.get('/', (req, res) => {
   res.render('index.twig', {
      name : req.params.name
   })
})

// page récupérant tous les membres
app.get('/members', (req, res) => {
   // fetch = ca vient de axios
   fetch.get('/members')
      .then((response) => {
         if(response.data.status == 'success') {
            // render = ca vient de twig
            res.render('members.twig', {
               members: response.data.result
            })
         } else {
            renderError(res, response.data.message)
         }
      })
      .catch((err) => renderError(res, err.message))
})

// page récupérant tous les membres
app.get('/members/:id', (req, res) => {
   fetch.get('/members/'+req.params.id)
      .then((response) => {
         if(response.data.status == 'success') {
            res.render('member.twig', {
               member: response.data.result
            })
         } else {
            // Todo debug error
            renderError(res, response.data.error)
         }
      })
      .catch((err) => renderError(res, err.message))
})

// Lancement app
app.listen(port, () => console.log('Started on port ' + port))


// Functions
function renderError(res, errMsg) {
   res.render('error.twig', {
      errorMsg: errMsg
   })
}
