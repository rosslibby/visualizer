import express from 'express'
import path from 'path'

const app = express()
app.use(express.static('src'))
app.use(express.static('src'))

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname })
})

const PORT = process
  ? process.env
    ? process.env.PORT
    : 8080
  : 8080

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))