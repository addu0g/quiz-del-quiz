var models = require('../models/models.js');

exports.load = function(req, res, next, quizId){
	models.Quiz.find({where: { id: Number(quizId) },
					include: [{ model: models.Comment }]
					}).then (function(quiz){
						if(quiz){
							req.quiz = quiz;
							next();
						}else{
							next(new Error('No existe quizId='+ quizId))
						}
					}).catch(function(error){next(error)});
};

exports.index = function(req, res){
	if(req.query.search === undefined){
		models.Quiz.findAll().then(function(quizes){
			models.Categoria.findAll().then(function(cat){
				res.render('quizes/index.ejs', {quizes: quizes, categoria:cat, errors: []});
			});
		}).catch(function(error){next(error)});
	}
	else{
		var regular =new RegExp(' ', 'g'); 
		var patron = ('%'+req.query.search+'%').replace(regular, '%');
		
		models.Quiz.findAll({where:["pregunta like ? AND CategoriumId = ?", patron, req.query.CategoriumId ]}).then(function(quizes){
				models.Categoria.findAll().then(function(cat){
					res.render('quizes/index.ejs', {quizes:quizes, categoria:cat, errors: []});
				});
		}).catch(function(error){next(error)});
	}
};

exports.show = function(req, res){
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		res.render('quizes/show', { quiz: req.quiz, errors:[] });
	})	
};

exports.answer = function(req, res){
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		var resultado = 'Incorrecto';
		if(req.query.respuesta.toLowerCase()=== req.quiz.respuesta.toLowerCase()){
			resultado='Correcto';
		}
		res.render('quizes/answer', {quiz:req.quiz,  respuesta:resultado, errors:[] });
	});
};

exports.new = function(req, res){
	var quiz = models.Quiz.build(
		{pregunta:'Pregunta', respuesta:'Respuesta', CategoriumId : 1}
	);
	models.Categoria.findAll().then(function(categ){
		res.render('quizes/new', {quiz:quiz, categoria:categ, errors : [] });
	});
};

exports.create = function(req, res){
	
	var quiz = models.Quiz.build(
		req.body.quiz
	);
	quiz.CategoriumId =parseInt(req.body.CategoriumId)+1;
	quiz
	.validate()
	.then(function(err){
		if(err){
			res.render('quizes/new', {quiz:quiz, errors: err.errors});
		}else{
			quiz
			.save({fields:["pregunta", "respuesta", "CategoriumId"]})
			.then(function(){res.redirect('/quizes')})
		}
	});
};

exports.edit = function(req, res){
	var quiz = req.quiz;
	models.Categoria.findAll().then(function(categ){
		res.render('quizes/edit', { quiz:quiz, categoria:categ, errors: [] });		
	});
	
}

exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.CategoriumId = req.body.CategoriumId;
	req.quiz
	.validate()
	.then(
		function(err){
			if(err){
				res.render('quizes/edit', {quiz: req.quiz, errors:err.errors});
			}else{
				req.quiz
				.save({fields: ["pregunta", "respuesta", "CategoriumId"]})
				.then(function(){ res.redirect('/quizes');});
			}
		}
	)
}

exports.destroy = function(req, res){
	console.log("------>"+req.quiz);
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
}
