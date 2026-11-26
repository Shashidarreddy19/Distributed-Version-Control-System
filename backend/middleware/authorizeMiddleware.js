const Repository = require('../models/repoModel');

// Checks that the logged-in user owns the repository before allowing mutations
const authorizeRepoOwner = async (req, res, next) => {
    const { repoId } = req.params;

    try {
        const repository = await Repository.findById(repoId);

        if (!repository) {
            return res.status(404).json({ error: "Repository not found!" });
        }

        if (repository.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: "Access denied. You do not own this repository." });
        }

        next();
    } catch (err) {
        return res.status(500).json({ error: "Authorization check failed." });
    }
};

module.exports = { authorizeRepoOwner };
