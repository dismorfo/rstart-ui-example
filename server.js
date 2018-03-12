'use strict'

const fs = require('fs')
const {promisify} = require('util')
const express = require('express')
const sassMiddleware = require('node-sass-middleware')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')
const app = express()

app.set('views', path.join(__dirname, 'src/views'))

app.set('view engine', 'hbs')

app.use(sassMiddleware({
  src: path.resolve(__dirname, 'src/sass'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'extended',
  prefix:  '/'
}))

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(require('express-bulma')('/bulma.css'))

app.get('/example/:api', (req, res, next) => {
  const readFileAsync = promisify(fs.readFile)
  readFileAsync(path.join(__dirname, 'src/datasource', req.params.api + '.json'), {encoding: 'utf8'})
    .then(contents => {
      res.json(JSON.parse(contents))
    })
    .catch(error => {
      throw error
    })
})

app.get('/', (req, res, next) => {
  res.render('index', {
    title: 'R* API',
    tabs: [
      {
        label: 'Partner array',
        request: '/example/partner-array',
        id: 'partner-array',
        api: '/api/v0/partners'
      },
      {
        label: 'Partner Object',
        request: '/example/partner-object',
        id: 'partner-object',
        api: '/api/v0/partners/a2ab971f-ce12-4799-96a3-d550207e2f54'
      },
      {
        label: 'Collection Array',
        request: '/example/collection-array',
        id: 'collection-array',
        api: '/api/v0/partners/a2ab971f-ce12-4799-96a3-d550207e2f54/colls'
      },
      {
        label: 'Collection Object',
        request: '/example/collection-object',
        id: 'collection-object',
        api: '/api/v0/colls/7c632f34-904e-457a-a4e1-23e158bbd187'
      },
      {
        label: 'SE Array',
        request: '/example/se-array',
        id: 'se-array',
        api: '/api/v0/colls/7c632f34-904e-457a-a4e1-23e158bbd187/ses'
      },
      {
        label: 'SE Object',
        request: '/example/se-object',
        id: 'se-object',
        api: '/api/v0/ses/823b7ca4-21e0-4673-ba0c-141e1eee7815'
      }
    ]
  })
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found')
      err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) =>  {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
