/**
 *  installing nodemon allows us to update our application without restarting it from the terminal.
 * for instance, instead of using node index.js you would call nodemon index.js after running
 * npm i -g nodemon.
 */

const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());


const courses = [
    {id: 1, name: 'Python'},
    {id: 2, name: 'React'},
    {id: 3, name: 'Java'}
];

app.get('/', function (req, res) {
    res.send("Hello, world!!!!");
    res.end();
});

app.get('/api/courses', (req, res)  => {
    res.send(courses);
    res.end();
});

app.get('/api/courses/:id', (req, res) => {
   const course = courses.find((c) => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send("Course not found");
    res.send(course);
});

app.get('/api/courses/:year/:month', (req, res) => {
    res.send(req.params);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body); // equivalent to result.error
    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put("/api/courses/:id", (req, res) => {

    // find the course
    // if the course is not found return a 404 error
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send("Course not found");
  

    // validate the course
    // if invalid return 400 - bad request
    const schema = {
        name: Joi.string().min(3).required()
    };
    
    const { error } = validateCourse(req.body); // equivalent to result.error
    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // update the course
    course.name = req.body.name;
    // return the updated course
    res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
    // lookup the course
    // if it doesn't exist, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send("Course not found");

    //delete the course
    const index = courses.indexOf(course);
    // use the splice method to to remove the course from our array of courses.
    courses.splice(index, 1);

    res.send(course);
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    
    return Joi.validate(course, schema);
}

// PORT 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));


