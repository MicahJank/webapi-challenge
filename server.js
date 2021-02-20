const express = require('express');
const cors = require('cors');
const projectRouter = require('./projects/projectRouter.js');
const actionRouter = require('./actions/actionRouter.js');

const server = express();


server.use(express.json());

server.use(logger);

server.use(cors());
server.use('/api/projects', projectRouter);
server.use('/api/actions', actionRouter);

server.get('/', (req, res) => {
    res.send(`<h2>Welcome to the sever!</h2>`);
});


function logger(req, res, next) {
    console.log({
        request_method: req.method,
        request_url: req.url,
        timestamp: Date().toString()
    });
    next();
};

module.exports = server;