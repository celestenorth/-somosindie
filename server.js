var express     = require('express'); // cargamos la libreria express en la variable (signo igual es asignacion)
var consolidate = require('consolidate');
var swig		= require('swig');
var mongoose    = require('mongoose');

// Configuracion de la base de datos
mongoose.connect('mongodb://localhost/somosindie');

var movieSchema = mongoose.Schema({
    name: String,
    description : String,
    director : String
});

var Movie = mongoose.model('Movie', movieSchema);
Movie.byCountry = function(country, callback){
	//Como hacer un query para encontrar peliculas por pais.
}

// Configuracion del server de express
var server = express();

swig.init({
	root : './views',
	cache : false
});

server.engine('.html', consolidate.swig);
server.set('view engine', 'html');
server.set('views', './views');

server.use( express.static('./public') ); //"use" significa que estamos usando un plugin. Aqui static es el plugin de express

// Aplicacion 
server.get('/', function (req, res) {
	res.render('index');
});

server.get('/movie/:movieName', function (req, res) {
	console.log('Un usuario ha visitado:', req.params.movieName);

	Movie.findOne({
		name : req.params.movieName
	}, function(err, movie){
		if(err){
			console.log(err);
			res.send(500);
			return;
		}

		if(!movie){
			console.log('Couldnt find movie');
			res.render(
				//template
				'movie-add',
				//data
				{
					movieName : req.params.movieName,
				}
			);			
			return;
		}

		res.render(
			//template
			'movie',
			//data
			{
				movieName : movie.name,
				description : movie.description,
				director : movie.director
			}
		);	
	});

	// res.render(
	// 	//template
	// 	'movie',
	// 	//data
	// 	{
	// 		movieName : req.params.movieName,
	// 	}
	// );

	// res.send('Esto es un review de ' + req.params.movieName);
});

server.get('/movie/:movieName/add', function(req, res){
	console.log('Nombre de la pelicula', req.params.movieName);
	console.log('description', req.query.description);
	console.log('director', req.query.director);

	var movie = new Movie({
		name : req.params.movieName,
		description : req.query.description,
		director : req.query.director
	});

	movie.save();

	res.send({
		name : req.params.movieName,
		description : req.query.description,
		director : req.query.director
	});
});

server.listen(3000);
console.log('Server running...');