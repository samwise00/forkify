const Joi = require('joi')
const express = require('express')
const app = express()

app.use(express.json())

const genres = [
    { id: 1, name: 'horror' },
    { id: 2, name: 'drama' },
    { id: 3, name: 'action' }
]

app.get('/', (req, res) => {
    res.send('Hello World!!!')
})

app.get('/api/genres', (req, res) => {
    res.send(genres)
})

app.post('/api/genres', (req, res) => {
    const result = validateGenre(req.body)
    if (result.error) return res.status(400).send(result.error.details[0].message)

    const genre = {
        id: genres.length + 1,
        name: req.body.name
    }
    genres.push(genre)
    res.send(genre)
})

app.put('/api/genres/:id', (req, res) => {
    // Look up the course
    // If not existing, return 404
    const genre = genres.find(c => c.id === parseInt(req.params.id))
    if (!genre) {
        return res.status(404).send('The genre with the given ID was not found.')
    }

    //Validate
    // If invalid, return 400 - Bad Request
    const result = validateGenre(req.body)
    if (result.error) {
        return res.status(400).send(result.error.details[0].message)
    }

    //Update course
    //Return the updated course
    genre.name = req.body.name
    res.send(genre)
})

app.delete('/api/genres/:id', (req, res) => {
    // Look up the course
    // Not existin, return 400
    const genre = genres.find(c => c.id === parseInt(req.params.id))
    if (!genre) return res.status(404).send('The genre with the given ID was not found.')

    // Delete
    const index = genres.indexOf(genre)
    genres.splice(index, 1)

    // Return the same course
    res.send(genre)
})

function validateGenre(course) {
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(course, schema)
}


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))