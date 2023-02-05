'use strict';

module.exports = function (app) {

  const mongoose = require('mongoose')
  mongoose.connect(process.env['MONGO_URI'])
          .then(() => console.log("-----connected mongoose successfully-----"))
          .catch((e) => console.log(e))
  let { 
    getAllIssue, 
    createIssue
  } = require('../controllers/functions')

  app.route('/api/issues/:project')
  
    .get(getAllIssue)
    
    .post(createIssue)
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
