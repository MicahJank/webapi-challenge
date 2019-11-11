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



function validateID(req, res, next) {
    const { id } = req.params;
    
    Action.get(id)
        .then(action => {
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
            res.status(500).json({
                message: 'There was a problem getting the action from the database'
            });
        });
}

module.exports = router;