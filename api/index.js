const { sql } = require('@vercel/postgres');
const express = require('express')
const app = express();

// enable middleware to parse body of Content-type: application/json
app.use(express.json());

const PORT = 4000;
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})

app.get('/', (request, response) => {
    response.status(200).json({ message: 'PRIN144-Final-Exam: Ralph Lee' });
});

// http://localhost:4000/students
app.get('/students', async (req, res) => {
    if (req.query) {
        if (req.query.id) {
            // http://localhost:4000/students?id=1
            const task = await sql`SELECT * FROM students WHERE id = ${req.query.id};`;
            if (task.rowCount > 0) {
                res.json(task.rows[0]);
            } else {
                res.status(404).json();
            }
            return;
        }
    }

    const students = await sql`SELECT * FROM students ORDER BY id;`;
    res.json(students.rows);
});

// http://localhost:4000/students/1
app.get('/students/:id', async (req, res) => {
    const id = req.params.id;
    const task = await sql`SELECT * FROM students WHERE id = ${id};`;

    if (task.rowCount > 0) {
        res.json(task.rows[0]);
    } else {
        res.status(404).json();
    }
});

// http://localhost:4000/students - { "given_name": "Juan", "family_name": "Dela Cruz", "year_level": 1, "course": "BSIT", "section": "A" }
app.post('/students', async (req, res) => {
    await sql`INSERT INTO students(given_name, family_name, year_level, course, section) VALUES
    (${req.body.given_name}, ${req.body.family_name}, ${req.body.year_level}, ${req.body.course}, ${req.body.section});`;

    res.status(201).json();
});

//http://localhost:4000/students/1 - { "given_name": "Juan", "family_name": "Dela Cruz", "year_level": 1, "course": "BSIT", "section": "A" }
app.put('/students/:id', async (req, res) => {
    const id = req.params.id;
    const entity = await sql`UPDATE students SET given_name = ${(req.body.given_name != undefined ? req.body.given_name : student.given_name)}
    , family_name = ${(req.body.family_name != undefined ? req.body.family_name : student.family_name)} 
    , year_level = ${(req.body.year_level != undefined ? req.body.year_level : student.year_level)} 
    , course = ${(req.body.course != undefined ? req.body.course : student.course)} 
    , section = ${(req.body.section != undefined ? req.body.section : student.section)} 
    WHERE id = ${id};`;

    if (entity.rowCount > 0) {
        const students = await sql`SELECT * FROM students WHERE id = ${id};`;
        res.status(200).json(students.rows[0]);
    } else {
        res.status(404).json();
    }
});

// http://localhost:4000/students/1
app.delete('/students/:id', async (req, res) => {
    const id = req.params.id;
    const entity = await sql`DELETE FROM students WHERE id = ${id};`;

    if (entity.rowCount > 0) {
        res.status(204).json();
    } else {
        res.status(404).json();
    }
});

module.exports = app;