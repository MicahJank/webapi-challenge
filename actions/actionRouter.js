const express = require('express');
const Action = require('../data/helpers/actionModel.js');

const router = express.Router();

router.get('/', (req, res) => {
    Action.get()
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(err => {
            res.status(500).json( { message: 'Could not retrieve the list of actions from the database' });
        });
});

router.get('/:id', validateID, (req, res) => {
    res.status(200).json(req.action);
});


router.put('/:id', validateID, validateBody, (req, res) => {
    const { id } = req.params;
    Action.update(id, req.body)
        .then(action => {
            res.status(200).json(action);
        })
        .catch(err => {
            res.status(500).json({
                message: 'There was a problem updating the action in the database'
            });
        });
});

router.delete('/:id', validateID, (req, res) => {
    const { id } = req.params;
    Action.remove(id)
        .then(num => {
            if(num > 0) {
                res.status(200).json(req.action);
            } else {
                res.status(404).json({ message: 'Could not find action with the specified id'} );
            };
        })
        .catch(err => {
            res.status(500).json({ message: 'There was a problem deleting the action from the database' });
        });
})


function validateID(req, res, next) {
    const { id } = req.params;
    
    Action.get(id)
    .then(action => {
        console.log(action);
            if(action) {
                req.action = action;
                next();
            } else {
                res.status(404).json({
                    message: 'Couldnt find the id of the action, please make sure the id is valid'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'There was a problem getting the action from the database'
            });
        });
}

function validateBody(req, res, next) {
    const { project_id, description, notes } = req.body;

    if(Object.entries(req.body).length === 0) {
        res.status(400).json({ message: 'No body data was found' });
    } else if(!project_id || !description || !notes) {
        res.status(400).json({ message: `Body is missing data. Please check that you have a 'project_id' field, 'description' field and 'notes' field inside the body request. ` });
    } else {
        next();
    }
};

module.exports = router;