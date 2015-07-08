var path = require('path');

var url=process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

var Sequelize = require('sequelize');

var sequelize = new Sequelize(DB_name,user,pwd,
		{	
			dialect:protocol,
			protocol:protocol,
			port:port,
			host:host,
			storage:storage,
			omitNull:true
		});

var quiz_path = path.join(__dirname, 'quiz');	
var Quiz = sequelize.import(quiz_path);

var comment_path= path.join(__dirname, 'comment');
var Comment =  sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

var categoria_path = path.join(__dirname, 'categoria');
var Categoria = sequelize.import(categoria_path);

Quiz.belongsTo(Categoria);
Categoria.hasMany(Quiz)

exports.Quiz = Quiz;
exports.Comment = Comment;
exports.Categoria = Categoria;

sequelize.sync().then(function(){
	Categoria.count().then(function(count)
	{
		if(count === 0){
			Categoria.create({
				nombre: 'Humanidades'
			});
			Categoria.create({
				nombre: 'Ocio'
			});
			Categoria.create({
				nombre: 'Ciencia'
			});
			Categoria.create({
				nombre: 'Tecnología'
			}).then(function(){
				console.log("Tabla de temas creada");
			});
		}
	});
	Quiz.count().then(function(count){
		if(count === 0){
			Quiz.create(
				{pregunta: 'Capital de Italia', respuesta:'Roma'}
			);
			Quiz.create(
				{pregunta: 'Capital de Portugal', respuesta:'Lisboa'}
			)
			.then(function(){
				console.log('Tabla de preguntas creada')
			});
		}
	})
});; 
