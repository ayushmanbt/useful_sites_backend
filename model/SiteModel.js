const mongoose = require('mongoose');

const SiteSchema = new mongoose.Schema({
    site_name: {
        type: String,
        required: true,
        unique: true
    },
    site_url: {
        type: String,
        required: true,
        unique: true
    },
    site_desc: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    user_id: {
        type: String
    } 
})

module.exports = mongoose.model("Site", SiteSchema);