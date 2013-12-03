var subscriberModule = require('../models/subscriptors');

module.exports = function(app) {

    app.get('/', function(request, response) {
	    subscriberModule.list(function(e, subs) {
		    response.render('index', { title: 'Subscriber List',error:'', subscriptors: subs });
		})
	})

	app.post('/', function(request, response) {
	   	subscriberModule.new({name: request.param('name'), email: request.param('email')}, function(o){
			subscriberModule.list(function(e, subs) {
				response.render('index', { title: 'Subscriber List', error:o, subscriptors: subs });
			})
		})
	})

	app.post('/save', function(request,response) {
		var string= {name: request.param('name'), email:request.param('email'), id:request.param('id')};
		subscriberModule.edit(string, function(o){
			if(o) {
				response.redirect('/');
			} else {
				response.send('update field fail',400)
			}
		})
	})

	app.post('/delete', function(request, response) {
		subscriberModule.delete(request.body.id, function(e,obj) {
			if(!e) {
				response.send('ok',200)
			} else {
				response.send('subscriber does no exist', 400)
			}
		})
	})

}