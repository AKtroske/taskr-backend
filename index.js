require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

//const query = require('./routes/queries')
const login = require('./routes/login')
const tasks = require('./routes/tasks')

const port = process.env.PORT || 8000

const app = express()

app.use(bodyParser.json())
app.use(cors({ origin: 'http://localhost:3000' }))

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// Setup CORS requests based on environment
// if (env === 'development') {
//   app.use(cors());
// } else {
//   app.use(
//     cors({
//       origin: 'https://app.mysite.co',
//       credentials: true,
//     }),
//   );
//}

//Authentication strategy
// Store JWT in local-storage and remember refresh token in a database-redis

app.use('/api/users', login)
app.use('/api/tasks', tasks)



app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
