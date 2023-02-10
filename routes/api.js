'use strict';

module.exports = function (app) {

  const mongoose = require('mongoose')
  mongoose.connect(process.env['MONGO_URI'])
          .then(() => console.log("-----connected mongoose successfully-----"))
          .catch((e) => console.log(e))
  let { 
    getIssue, 
    createIssue,
    updateIssue,
    deleteIssue
  } = require('../controllers/functions')

  app.route('/api/issues/:project')
  
    .get(getIssue)
    
    .post(createIssue)
    
    .put(updateIssue)
    
    .delete(deleteIssue);
    
};
