import express, { type Express, type Request, type Response } from 'express'

const app: Express = express()

app.use(express.json())

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the backend!' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

export default app
