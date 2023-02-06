const { request } = require('chai')
const Issue = require('../models/Issue')

const getAllIssue = async(req, res) => {
    try {
        const issues = await Issue.find()
        res.status(200).send( issues )
    } catch(error) {
        res.status(500).json({message: error})
    }
}

const createIssue = async(req, res) => {
    try {
        const { 
            issue_title,
            issue_text,
            created_by,
            assigned_to,
            open,
            status_text
        } = req.body; 

        let date = new Date()

        if (!assigned_to && !status_text) {

            const issue = await Issue.create({
              issue_title,
              issue_text,
              created_on: date,
              updated_on: date,
              created_by,
              assigned_to: "",
              open,
              status_text: ""
            })
      
            return res.status(201).send(issue)
          }
      
          if (!assigned_to) {
      
            const issue = await Issue.create({
              issue_title,
              issue_text,
              created_on: date,
              updated_on: date,
              created_by,
              assigned_to: "",
              open,
              status_text
            })
      
            return res.status(201).send(issue)
          }
      
          if (!status_text) {
      
            const issue = await Issue.create({
              issue_title,
              issue_text,
              created_on: date,
              updated_on: date,
              created_by,
              assigned_to,
              open,
              status_text: ""
            })
      
            return res.status(201).send(issue)
          }
      
          const issue = await Issue.create({
            issue_title,
            issue_text,
            created_on: date,
            updated_on: date,
            created_by,
            assigned_to,
            open,
            status_text
          })
      
          return res.status(201).send(issue)
          
    } catch (error) {
        res.status(500).json({message: error})
    }
}

module.exports = {
    getAllIssue,
    createIssue
}