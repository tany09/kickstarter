const routes = require('next-routes')();

routes
    .add('/campaign/new', 'campaign/new')
    .add('/campaign/:address', '/campaign/show')
    .add('/campaign/:address/request', '/campaign/request/index')
    .add('/campaign/:address/request/new', '/campaign/request/new');
   
   
module.exports = routes;
