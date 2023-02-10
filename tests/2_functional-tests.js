const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let api = '/api/issues/:project'
let put_id = '63e6bbcf58459e0e31c10681'

let keys = [
  '_id',
  'issue_title',
  'issue_text',
  'created_on',
  'updated_on',
  'created_by',
  'assigned_to',
  'open',
  'status_text'
]

suite('Functional Tests', function() {

  test("POST - an issue with every field", (done) => {
    chai
      .request(server)
      .post(api)
      .send({
        "issue_title": "Fix error in posting data",
        "issue_text": "When we post data it has an error.",
        "created_by": "Joe",
        "assigned_to": "Joe",
        "status_text": "In QA"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200)
        assert.containsAllKeys(res.body, keys)
        done()
      })
  })

  test("POST - an issue with only required field", (done) => {
    chai
      .request(server)
      .post(api)
      .send({
        "issue_title": "Fix error in posting data",
        "issue_text": "When we post data it has an error.",
        "created_by": "Joe"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200)
        assert.containsAllKeys(res.body, keys)
        done()
      })
  })

  test("POST - an issue with missing required field", (done) => {
    chai
      .request(server)
      .post(api)
      .send({
        "assigned_to": "Joe",
        "status_text": "In QA"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { error: 'required field(s) missing' })
        done()
      })
  })

  test("GET - View issues on a project", function(done) {
    chai
        .request(server)
        .get(api)
        .end(function(err, res) {
          if (err) return console.log(err)
          assert.equal(res.status, 200)
          res.body.forEach((issue) => {
            assert.containsAllKeys(issue, keys)
          })
          done()
        })
  })

  test("GET - View issues on a project with one filter", function(done) {
    chai
        .request(server)
        .get(api+"?created_by=fCC")
        .end(function(err, res) {
          if (err) return console.log(err)
          assert.equal(res.status, 200)
          res.body.forEach((issue) => {
            assert.deepEqual(issue.created_by, "fCC")
          })
          done()
        })
  })

  test("GET - View issues on a project with multiple filter", function(done) {
    chai
        .request(server)
        .get(api+"?created_by=fCC&open=true")
        .end(function(err, res) {
          if (err) return console.log(err)
          assert.equal(res.status, 200)
          res.body.forEach((issue) => {
            assert.deepEqual(issue.created_by, "fCC")
            assert.deepEqual(issue.open, 'true')
          })
          done()
        })
  })

  test("PUT - update one field on an issue", function(done) {
    chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id: put_id,
          created_by: "Chrono"
        })
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          assert.equal(res.status, 200)
          assert.isObject(body)
          assert.deepEqual(body, { 
            result: "successfully updated", _id: body._id 
          })
          done()
        })
  })

  test("PUT - update multiple field on an issue", function(done) {
    chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id: put_id,
          created_by: "Chrono",
          open: false
        })
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          assert.equal(res.status, 200)
          assert.isObject(body)
          assert.deepEqual(body, { 
            result: "successfully updated", _id: body._id 
          })
          done()
        })
  })

  test("PUT - update an issue with missing _id", function(done) {
    chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          created_by: "Chrono",
          open: false
        })
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          assert.equal(res.status, 200)
          assert.isObject(body)
          assert.deepEqual(body, { 
            error: "missing _id"
          })
          done()
        })
  })
  
  test("PUT - Update an issue with no fields to update", function(done) {
    chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id: put_id
        })
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          assert.equal(res.status, 200)
          assert.isObject(body)
          assert.deepEqual(body, { 
            error: "no update field(s) sent", _id: body._id
          })
          done()
        })
  })
  
  test("PUT - update an issue with an invalid _id", function(done) {
    chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id: put_id
        })
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          assert.equal(res.status, 200)
          assert.isObject(body)
          assert.deepEqual(body, { 
            error: "no update field(s) sent", _id: body._id
          })
          done()
        })
  })
  let delete_id = '63e6c49f8ab1ffe1dc5821ff'

  test("DELETE - Delete an issue", function(done) {

    chai
        .request(server)
        .delete('/api/issues/apitest')
        .send({_id: delete_id})
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          assert.equal(res.status, 200)
          assert.isObject(body)
          assert.deepEqual(body, { 
            result: "successfully deleted", _id: body._id
          })
          done()
        })
  })

  test("DELETE - delete an issue with an invalid _id", function(done) {

    chai
        .request(server)
        .delete('/api/issues/apitest')
        .send({_id: '63e6c2387dc34c83772fbces'})
        .end(function(err, res) {
          if (err) console.log(err)
          console.log(res.body)
          assert.equal(res.status, 500)
          assert.isObject(body)
          assert.deepEqual(body, { 
            error: "could not delete", _id: body._id
          })
          done()
        })
  })

  test("DELETE - delete an issue with an missing _id", function(done) {

    chai
        .request(server)
        .delete('/api/issues/apitest')
        .send({})
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          assert.equal(res.status, 200)
          assert.isObject(body)
          assert.deepEqual(body, { 
            error: "missing _id"
          })
          done()
        })
  })
});
