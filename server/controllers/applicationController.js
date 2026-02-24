const Application = require('../models/Application') // Application schema from the export

// Get all applications
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await Application
            .find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error: error.message });
    }
};

// Create new applications
exports.createApplication = async (req, res) => {
    try {
        const { company, position, status, notes, followUpDate } = req.body;

        const newApplication = new Application({
            user: req.user.id,
            company,
            position,
            status,
            notes,
            followUpDate
        });

        const savedApplication = await newApplication.save()
        res.status(201).json(savedApplication);
    } catch (error) {
        res.status(400).json({ message: 'Error creating application',  error: error.message });
    }
};

// Update application
exports.updateApplication = async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            user: req.user.id
        });
        
        if(!application){
            return res.status(404).json({ message: "Application not found." });
        }
        
        const updatedApplication = await Application.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new : true, runValidators: true}
        );

        if(!updatedApplication) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json(updatedApplication);

    } catch (error) {
        res.status(400).json({ message: 'Error updating application', error: error.message });
    }
}

// Delete application
exports.deleteApplication = async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            user: req.user.id
        });
        
        if(!application){
            return res.status(404).json({ message: "Application not found." });
        }

        const deletedApplication = await Application.findByIdAndDelete(req.params.id);

        if(!deletedApplication) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json({ message: 'Application deleted successfully '});

    } catch (error) {
        res.status(500).json({ message: 'Error deleting application', error: error.message });
    }
};
