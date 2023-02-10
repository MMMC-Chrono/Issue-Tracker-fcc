const { request } = require('chai');
// const { findOneAndUpdate } = require('../models/Issue');
const mongoose = require('mongoose')
const Issue = require('../models/Issue')

const getIssue = async (req, res) => {
  try {
    const { project } = req.params
    const { query } = req;

    let result = []
    const search_project = await Issue.find({ project: project })

    for (let project of search_project) {
      result.push(project.issues)
    }

    if (Object.keys(query).length === 0) {
      return res.status(200).send(result)
    }

    if (query.hasOwnProperty("open")) {
      query.open = query.open === "true" ? true : false;
    }

    let filteredArr = result.filter(r => {
      for (let q in query) {
        if (r[q] !== query[q]) {
          return false
        }
      }
      return true
    })
    return res.status(200).send(filteredArr)

  } catch (error) {
    res.status(500).json({ message: error })
  }
}

const createIssue = async (req, res) => {
  try {

    const {
      issue_title,
      issue_text,
      created_by,
      assigned_to,
      open,
      status_text
    } = req.body;

    const { project } = req.params;

    let date = new Date()

    if (!issue_title || !issue_text || !created_by) {
      return res.json({ error: 'required field(s) missing' })
    }

    if (!assigned_to && !status_text) {
      let projectIssue = await Issue.create(
        {
          project: project,
          issues: {
            issue_title,
            issue_text,
            created_on: date,
            updated_on: date,
            created_by,
            assigned_to: "",
            open,
            status_text: ""
          }
        })
      return res.status(200).send(projectIssue.issues)
    }

    if (!assigned_to) {
      let projectIssue = await Issue.create(
        {
          project: project,
          issues: {
            issue_title,
            issue_text,
            created_on: date,
            updated_on: date,
            created_by,
            assigned_to: "",
            open,
            status_text
          }
        })
      return res.status(200).send(projectIssue.issues)
    }

    if (!status_text) {
      let projectIssue = await Issue.create(
        {
          project: project,
          issues: {
            issue_title,
            issue_text,
            created_on: date,
            updated_on: date,
            created_by,
            assigned_to,
            open,
            status_text: ""
          }
        })
      return res.status(200).send(projectIssue.issues)
    }

    let projectIssue = await Issue.create(
      {
        project: project,
        issues: {
          issue_title,
          issue_text,
          created_on: date,
          updated_on: date,
          created_by,
          assigned_to,
          open,
          status_text
        }
      })
    return res.status(200).send(projectIssue.issues)

  } catch (error) {
    res.status(500).json({ message: error })
  }
}

const updateIssue = async (req, res) => {
  const { project } = req.params
  const { _id } = req.body;
  try {
    let { body } = req;
    
    if (_id === undefined) {
      return res.status(200).send({ error: 'missing _id' })
    }
    
    for (let i in body) {
      if (body[i] === "" || i === "_id") {
        delete body[i]
      }
    }

    if (Object.keys(body).length === 0) {
      return res.status(200).send({ error: 'no update field(s) sent', '_id': _id })
    }

    let find_issue = await Issue.find({ project: project, "issues._id": _id })
    let test_issue = find_issue[0]
    if (!test_issue) {
      return res.status(200).send({ error: 'could not update', '_id': _id })
    }
    
    if (JSON.stringify(find_issue).length > 10) {

      const change_issue = JSON.stringify(find_issue[0].issues);
    let issueObj = JSON.parse(change_issue)
    
    if (!Boolean(issueObj.open)) {
      issueObj.open = issueObj.open === 'true' ? true: false;
    }
      
    for (let i in issueObj) {
      if (!body[i] === false) {
        issueObj[i] = body[i]
      }
    }
      
    const date = new Date()
    issueObj.updated_on = date.toISOString()
      
      Issue.findOneAndUpdate(
        {  "issues._id": _id },
        {  issues: issueObj },
        { new: true }, 
        function(err, docs) {
          if (err) console.log(err)
          else console.log(docs)
        })    
      
      return res.status(200).send({  result: 'successfully updated', '_id': _id })
    }
    
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: 'could not update', '_id': _id })
  }
}


const deleteIssue = async (req, res) => {
  const { project } = req.params;
  const { _id } = req.body;

  try {
    if (_id === undefined) {
      return res.status(200).send({ error: 'missing _id' })
    }
    let find_issue = await Issue.find({ project: project, "issues._id": _id })

    if (JSON.stringify(find_issue).length < 10) {
      return res.status(200).send({ error: 'could not delete', '_id': _id })
    }

    if (JSON.stringify(find_issue).length > 10) {
      await Issue.findOneAndDelete({ "issues._id": _id })
      return res.status(200).send({ result: 'successfully deleted', '_id': _id })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: 'could not delete', '_id': _id })
  }
}

module.exports = {
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue
}