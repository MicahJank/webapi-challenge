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


router.put('/:id', validateID, validateBody, (req, res) => {
    const { id } = req.params;
    Project.update(id, req.body)
        .then(project => {
            res.status(200).json(project);
        })
        .catch(err => {
            res.status(500).json({
                message: 'Could not update the project',
                error: err
            });
        });
});


router.delete('/:id', validateID, (req, res) => {
    const { id } = req.params;
    Project.remove(id)
        .then(num => {
            if(num > 0) {
                res.status(200).json(req.project);
            } else {
                res.status(404).json({ message: 'Could not find the project with the specified id' });
            };
        })
        .catch(err => {
            res.status(500).json({
                message: 'Could not remove the project from the database',
                error: err
            });
        });
});


// get all project actions for a specific project
router.get('/:id/actions', validateID, (req, res) => {
    const { id } = req.params;
    Project.getProjectActions(id)
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(err => {
            res.status(500).json({
                message: 'There was a problem getting the actions for the specified project',
                error: err
            });
        });
});


// post a new action to the specific project
router.post('/:id/actions', validateID, (req, res) => {
    const { project_id, description, notes } = req.body;
    if(Object.entries(req.body).length === 0) {
        res.status(400).json({ message: 'No body data was found' });
    } else if(!project_id || !description || !notes) {
        res.status(400).json({ message: `Body is missing data. Please check that you have a 'project_id' field, 'description' field and 'notes' field inside the body request. ` });
    } else {
        Action.insert(req.body)
            .then(action => {
                res.status(201).json(action);
            })
            .catch(err => {
                res.status(500).json({
                    message: 'There was a problem inserting the action to the specified project',
                    error: err
                });
            });
    };
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
                    message: `No project with id: ${id} was found.`
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