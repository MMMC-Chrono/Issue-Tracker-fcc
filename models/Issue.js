const mongoose = require('mongoose')

const ISchema = new mongoose.Schema({
    issue_title: {
        type: String,
        required: true
    },
    issue_text: {
        type: String,
        required: true
    },
    created_on: Date,
    updated_on: Date,
    created_by: {
        type: String,
        required: true
    },
    assigned_to: {
        type: String,
    },
    open: {
        type: Boolean,
        default: true
    },
    status_text: {
        type: String
    }
})

const IssueSchema = new mongoose.Schema({
    
    project: String,
    issues: ISchema
}, {
    versionKey: false
})


module.exports = mongoose.model('Issue', IssueSchema)