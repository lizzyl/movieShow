var Movie = require('../models/movie')
var Comment = require('../models/comment')
var Category = require('../models/category')
var _ = require('underscore')

var fs = require('fs');
var path = require('path')

//admin update movie
exports.update = function(req, res) {
	var id = req.params.id

	if(id) {
		Movie.findById(id, function(err, movie) {
			Category.find({}, function(err, categories) {
				res.render('admin', {
					title: 'movie后台更新页面',
					movie: movie,
					categories: categories
				})				
			})
		})
	}
}

//admin post movie
exports.save = function(req, res) {
	// console.log(req.body.movie)
	var id = req.body.movie._id
	console.log('movieId: ')
	console.log(id)
	var movieObj = req.body.movie

	var _movie
	
	// console.log('req.poster: ')
	// console.log(req.poster.indexOf('http:') > -1)

	if(req.poster) {
		movieObj.poster = req.poster
	}

	if(id) {
		Movie.findById(id, function(err, movie) {
			if(err) {
				console.log(err)
			}
			_movie = _.extend(movie, movieObj)

			var categoryId = _movie.category;
			var categoryName = _movie.categoryName;

			_movie.save(function(err, movie) {
				if(err) {
					console.log(err)
				}
				if(categoryId) {
					Category.findById(categoryId, function(err, category) {
						category.movies.push(movie._id);
						category.save(function(err, category) {
							res.redirect('/movie/' + movie._id)
						})
					})				
				} else if(categoryName) {
					var category = new Category({
						name: categoryName,
						movies: [movie._id]
					})

					category.save(function(err, category) {
						movie.category = category._id;
						movie.save(function(err, movie) {
							res.redirect('/movie/' + movie._id)
						})
						
					})
				}
				// res.redirect('/movie/' + movie._id)
			})
		})
	} else {
		_movie = new Movie(movieObj)

		var categoryId = movieObj.category;
		var categoryName = movieObj.categoryName;

		_movie.save(function(err, movie) {
			if(err) {
				console.log(err)
			}
			if(categoryId) {
				Category.findById(categoryId, function(err, category) {
					category.movies.push(movie._id);
					category.save(function(err, category) {
						res.redirect('/movie/' + movie._id)
					})
				})				
			} else if(categoryName) {
				var category = new Category({
					name: categoryName,
					movies: [movie._id]
				})

				category.save(function(err, category) {
					movie.category = category._id;
					movie.save(function(err, movie) {
						res.redirect('/movie/' + movie._id)
					})
					
				})
			}
	
		})
	}
}

// list page
exports.list = function(req, res) {
	Movie
		.find({})
		.sort('meta.updateAt')
		.populate('category', 'name')
		.exec(function(err, movies) {
			if(err) {
				console.log(err)
			}
			res.render('list', {
				title: 'movie 列表页',
				movies: movies
			})
		})
	// Movie.fetch(function(err, movies) {
	// 	if(err) {
	// 		console.log(err)
	// 	}
	// 	res.render('list', {
	// 		title: 'movie 列表页',
	// 		movies: movies
	// 	})
	// }).populate('category', 'name')	
}

// detail page
exports.detail = function(req, res) {
	var id = req.params.id

	Movie.update({_id: id}, {$inc: {pv: 1}}, function(err) {
		if(err) {
			console.log(err)
		}

	})

	Movie.findById(id, function(err, movie) {
		if(err) {
			console.log(err)
		}
		
		Comment.find({movie: id})
		.populate('from', 'name')
		.populate('reply.from reply.to', 'name')
		.exec(function(err, comments) {
			console.log('comments: ')
			console.log(comments);
			res.render('detail', {
				title: 'movie 详情页' + movie.title,
				movie: movie,
				comments: comments
			})			
		})

	})
	
}

// admin new page
exports.new = function(req, res) {
	Category.find({}, function(err, categories) {
		res.render('admin', {
			title: 'movie 后台录入页',
			categories: categories,
			movie: {}
		})		
	})

}

//list delete movie
exports.del = function(req, res){
	var id = req.query.id

	if(id) {
		Movie.remove({_id: id}, function(err, movie) {
			if(err) {
				console.log(err)
			} else {
				Category.remove({movies: id})
				res.json({success: 1})
			}
		})
	}
}

//admin poster
exports.savePoster = function(req, res, next) {

	var posterData = req.files.uploadPoster;
	console.log('posterData:  ')
	console.log(posterData)
	var filePath = posterData.path;
	var originalFilename = posterData.originalFilename;
	// console.log(poster.indexOf('http:') > -1)
	// console.log(req.files)

	if(originalFilename !== '') {
		fs.readFile(filePath, function(err, data) {
			var timestamp = Date.now();
			var type = posterData.type.split('/')[1];
			var poster = timestamp + '.' + type
			console.log('poster file: ')
			console.log(poster.indexOf('http:') > -1)
			var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);
			fs.writeFile(newPath, data, function(err) {
				req.poster = poster;
				// next();
			})
		})
	}
	next();
}
