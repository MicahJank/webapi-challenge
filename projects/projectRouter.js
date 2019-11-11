const express = require('express');
const Project = require('../data/helpers/projectModel.js');
const Action = require('../data/helpers/actionModel.js');

const router = express.Router();

// should return an array of all projects
router.get('/', (req, res) => {
    Project.get()
        .then(projects => {
            res.status(200).json(projects);
        })
        .catch(err => {
            res.status(500).json({
                message: 'Couldnt retrieve the projects from the database',
                error: err
            });
        });
});


router.get(`/:id`, validateID, (req, res) => {
    res.status(200).json(req.project);
});


router.post('/', validateBody, (req, res) => {
    Project.insert(req.body)
        .then(project => {
            res.status(201).json(project);
        })
        .catch(err => {
            res.status(500).json({ message: 'Couldnt add the project to the database' });
        });
});


// middleware
function validateID(req, res, next) {
    const { id } = req.params;
    Project.get(id)
        .then(project => {
            if(project) {
                req.project = project;
                next();
            } else {
                res.status(404).json({
                    message: `No project with id: ${id} was found.`,
                    error: err
                });
            };
        })
        .catch(err => {
            res.status(500).json({
                message: `There was a problem getting the project from the database`,
                error: err
            });
        });
}

function validateBody(req, res, next) {
    const { name, description } = req.body;

    if(Object.entries(req.body).length === 0) {
        res.status(400).json({ message: 'No body data was found' });
    } else if(!name || !description) {
        res.status(400).json({ message: 'Body is missing either the name or description field' });
    } else {
        next();
    };
};


module.exports = router;