import express, { type Express } from 'express'
import router from './controllers'

const app: Express = express()

app.use(express.json())

app.use('/api', router)

const PORT = parseInt(process.env.PORT as string) || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

export default app
