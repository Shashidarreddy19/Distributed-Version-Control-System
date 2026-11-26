const Repository = require('../models/repoModel');
const Issue = require('../models/issueModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const createIssue = async (req, res) => {
    const { title, description, repoId } = req.body;

    try {
        if (!title || !description || !repoId) {
            return res.status(400).json({ error: "Title, description, and repoId are required!" });
        }

        const issue = new Issue({
            title,
            description,
            repository: repoId,
        });

        await issue.save();
        res.status(201).json(issue);
    } catch (err) {
        console.error("Error creating Issue:", err.message);
        res.status(500).send("Server error");
    }
};

const updateIssueById = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    
    try {
        const updateFields = {};

        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        if (status) updateFields.status = status;
        
        const issue = await Issue.findByIdAndUpdate(id, updateFields, { new: true });
        
        if (!issue) {
            return res.status(404).json({ error: "Issue not found!" });
        }

        res.status(200).json({ message: "Issue updated successfully!", issue });
    } catch (err) {
        console.error("Error updating Issue:", err.message);
        res.status(500).send("Server error");
    }
};

const deleteIssueById = async (req, res) => {
    const { id } = req.params;

    try {   
        const issue = await Issue.findByIdAndDelete(id);
        
        if (!issue) {
            return res.status(404).json({ error: "Issue not found!" });
        }

        res.status(200).json({ message: "Issue deleted successfully!" });
    } catch (err) {
        console.error("Error deleting Issue:", err.message);
        res.status(500).send("Server error");
    }
};

const getAllIssues = async (req, res) => {
    const { repoId } = req.query;

    try {
        const query = repoId ? { repository: repoId } : {};
        const issues = await Issue.find(query);

        res.status(200).json(issues);
    } catch (err) {
        console.error("Error during fetching issues:", err.message);
        res.status(500).send("Server error");
    }
};

const getIssueById = async (req, res) => {
    const { issueId } = req.params;

    try {
        const issue = await Issue.findById(issueId);
        
        if (!issue) {
            return res.status(404).json({ error: "Issue not found!" });
        }

        res.status(200).json({ message: "Issue found successfully!", issue });
    } catch (err) {
        console.error("Error fetching issue:", err.message);
        res.status(500).send("Server error");
    }
};

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
};
