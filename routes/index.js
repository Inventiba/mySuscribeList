var subscriptorModule = require('../models/subscriptors')
module.exports = function(app) {

	app.get('/', function(request, response) {
	    subscriptorModule.list(function(e, subs) {
		    response.render('index', { title: 'Lista de suscriptores',error:'', subscriptors: subs });
		})
	})

	app.post('/', function(request, response) {
	   	subscriptorModule.new({name: request.param('name'), email: request.param('email')}, function(o){
			subscriptorModule.list(function(e, subs) {
				response.render('index', { title: 'Lista de suscriptores', error:o, subscriptors: subs });
			})
		})
	})

	app.post('/save', function(request,response) {
		subscriptorModule.edit({name: request.param('name'), email:request.param('email'), id:request.param('id')}, function(o){
			if(o) {
				response.redirect('/');
			} else {
				response.send('Error al actualiza registro',400)
			}
		})
	})

	app.post('/delete', function(request, response) {
		subscriptorModule.delete(request.body.id, function(e,obj) {
			if(!e) {
				response.send('ok',200)
			} else {
				response.send('El subscriptor a eliminar no existe', 400)
			}
		})
	})

}