var Category = require('../models/category')

var _ = require('underscore')

//admin update movie
// exports.update = function(req, res) {
//   var id = req.params.id

//   if(id) {
//     Category.findById(id, function(err, category) {
//       res.render('admin', {
//         title: 'movie后台更新页面',
//         categories: categories
//       })        
//     })
//   }
// }

//admin post movie
exports.save = function(req, res) {
  var _category = req.body.category

  var category = new Category(_category)

  category.save(function(err, category) {
    if(err) {
      console.log(err)
    }
// console.log('/movie/' + movie._id)
    res.redirect('/admin/category/list')
  })

}

// list page
exports.list = function(req, res) {
  Category.fetch(function(err, categories) {
    if(err) {
      console.log(err)
    }
    res.render('categorylist', {
      title: 'movie 分类列表页',
      categories: categories
    })
  })  
}


// admin page
exports.new = function(req, res) {
  res.render('category_admin', {
    title: 'movie 后台分类录入页',
    category: {
      name: ''
    }
  })
}


