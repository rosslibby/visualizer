import express from 'express'
import path from 'path'

const app = express()
app.use(express.static('src'))
app.use(express.static('src'))

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname })
})

app.listen(8080, () => console.log(`Listening on port 8080`))