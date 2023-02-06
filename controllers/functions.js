const { request } = require('chai')
const Issue = require('../models/Issue')

const getAllIssue = async(req, res) => {
    try {
        const issues = await Issue.find()
        res.status(200).json({ issues })
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
            assign_to,
            open,
            status_text
        } = req.body; 

        let date = new Date()
        if (assign_to === "") {
            const issue = await Issue.create({
                issue_title,
                issue_text,
                created_on: date,
                updated_on: date,
                created_by,
                open,
                status_text
            })

            res.status(201).json({issue})
        }

        if (status_text === "") {
            const issue = await Issue.create({
                issue_title,
                issue_text,
                created_on: date,
                updated_on: date,
                created_by,
                assign_to,
                open
            })

            res.status(201).json({issue})
        }

        const issue = await Issue.create({
            issue_title,
            issue_text,
            created_on: date,
            updated_on: date,
            created_by,
            assign_to,
            open,
            status_text
        })

        res.status(201).json({issue})
        
    } catch (error) {
        res.status(500).json({message: error})
    }
}

module.exports = {
    getAllIssue,
    createIssue
}