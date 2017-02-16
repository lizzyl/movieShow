var Movie = require('../models/movie')
var Category = require('../models/category')

// index page
exports.index = function(req, res) {
	Category
		.find({})
		.populate({
			path: 'movies',
			select: 'title poster',
			options: {limit: 6}
		})
		.exec(function(err, categories) {
			if(err) {
				console.log(err)
			}
			console.log(categories)
			res.render('index', {
				title: 'movie 首页',
				categories: categories
			})			
		})

}

//search
exports.search = function(req, res) {
	var catId = req.query.cat;
	var page = parseInt(req.query.p, 10) || 0;
	var count = 1
	var index = page * count;

	var q = req.query.q;

	if(catId) {//分类
		Category
			.find({_id: catId})
			.populate({
				path: 'movies',
				select: 'title poster'
			})
			.exec(function(err, categories) {
				if(err) {
					console.log(err)
				}
				var category = categories[0] || {};
				var movies = category.movies || [];
				var results = movies.slice(index, index + count)

				res.render('results', {
					title: 'movie 搜索结果列表',
					keyword: category.name,
					currentPage: (page + 1),
					totalPage: Math.ceil(movies.length/count),
					query: 'cat=' + catId,
					movies: results
				})			
			})		
	}else{//搜索
		Movie
			.find({title: new RegExp(q + '*', 'i')})
			.exec(function(err, movies) {
				if(err) {
					console.log(err)
				}

				var results = movies.slice(index, index + count)

				res.render('results', {
					title: 'movie 搜索结果列表',
					keyword: q,
					currentPage: (page + 1),
					totalPage: Math.ceil(movies.length/count),
					query: 'q=' + q,
					movies: results
				})					
			})
	}


}
