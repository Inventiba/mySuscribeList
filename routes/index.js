var subscriberModule = require('../models/subscriptors');

module.exports = function(app) {

    app.get('/', function(request, response) {
        subscriberModule.list(function(error, subs) {
            response.render('index', { title: 'Subscriber List',error:'', subscriptors: subs });
        });
    });

    app.post('/', function(request, response) {
        var fields = {name: request.param('name'), email: request.param('email')};
        subscriberModule.new(fields, function(e) {
            subscriberModule.list(function(error, subs) {
                response.render('index', { title: 'Subscriber List', error:e, subscriptors: subs });
            });
        });
    });

    app.post('/save', function(request,response) {
        var fields= {name: request.param('name'), email:request.param('email'), id:request.param('id')};
        subscriberModule.edit(fields, function(objeto) {
            if(objeto) {
                response.redirect('/');
            } else {
                response.send('update field fail', 400);
            }
        });
    });

    app.post('/delete', function(request, response) {
        subscriberModule.delete(request.body.id, function(error,obj) {
            if(!error) {
                response.send('ok', 200);
            } else {
                response.send('subscriber does no exist', 400);
            }
        });
    });
}