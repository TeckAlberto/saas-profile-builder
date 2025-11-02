import express, { type Express } from 'express'

import router from './controllers'

const app: Express = express()

app.use(express.json())

app.use('/api', router)

export default app
