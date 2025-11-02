import app from './app'

const PORT = parseInt(process.env.PORT as string) || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
