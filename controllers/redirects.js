'use strict';

var searchUrlService = require('../services/searchUrl');

function setup (app) {
  app.get('/:year(\\d{4})/:month([01]\\d)/:day([0-3]\\d)/:slug', redirect('/articles/:slug'));
  app.get('/:year(\\d{4})/:month([01]\\d)/:day([0-3]\\d)', redirect('/articles/:year/:month/:day'));
  app.get('/:year(\\d{4})/:month([01]\\d)', redirect('/articles/:year/:month'));
  app.get('/:year(\\d{4})', redirect('/articles/:year'));
  app.get('/search/tagged/:tags', redirect('/articles/tagged/:tags'));
  app.get('/search/:terms', redirect('/articles/search/:terms'));
  app.get('/articles/search', searchTerms);
  app.get('/rss/latest.xml', redirect('/articles/feed'));
  app.get('/rss', redirect('/articles/feed'));
  app.get('/feed', redirect('/articles/feed'));
  app.get('/articles/rss', redirect('/articles/feed'));
  app.get('/user/profile/:id', redirect('/'));
}

function redirect (template, qs) {
  return function middleware (req, res, next) {
    var part = qs ? 'query' : 'params';
    var endpoint = Object.keys(req[part]).reduce(map, template);
    res.redirect(endpoint);

    function map (endpoint, prop) {
      return endpoint.replace(':' + prop, req[part][prop]);
    }
  };
}

function searchTerms (req, res, next) {
  var route = searchUrlService.compile(req.query.terms);
  if (route) {
    res.redirect(route);
  } else {
    res.redirect('/');
  }
}

module.exports = {
  setup: setup
};
