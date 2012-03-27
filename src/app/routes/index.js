exports.index = function(req, res) {
  res.render('index', { title: 'WebGrid' })
}

exports.admin = function(req, res) {
	res.render('admin', { title: 'Admin' })
}
