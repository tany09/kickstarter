const next = require('next');

const routes = require('./routes');
const app = next({dev});
const handler = routes.getRequestHandler(app);
const port = process.env.PORT

const {createServer} = require('http');
app.prepare().then(() => {
    createServer(handler).listen(port, (err) => {
        if (err) throw err;
        console.log('Ready on localhost 3000');
    });
})