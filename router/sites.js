const express = require("express");
const Site = require("../model/SiteModel");
const { update } = require("../model/SiteModel");

const siteRouter = express.Router();


siteRouter.get("/all", (req, res) => {
    Site.find()
        .then(siteList => {
            res.json({sites: siteList})
        })
        .catch(err => {
            res.status(500).json({message: "Something went wrong", error: err})
        })
})

siteRouter.get("/id/:id", (req, res) => {
    const id = req.params.id;
    Site.findById(id)
        .then(site => {
            res.json({site});
        })
        .catch(err => {
            res.status(500).json({message: "Something went wrong or id not available"})
        })
})

siteRouter.post("/add", (req, res) => {
    let {site_name, site_url, site_desc = ""} = req.body;
    if(site_name == undefined) return res.status(400).json({message: "Site Name Required"})
    if(site_url == undefined) return res.status(400).json({message: "Site Name Required"});

    let newSite = new Site({
        site_name,
        site_url,
        site_desc
    })

    newSite.save()
        .then(site => {
            res.status(201).json({
                message: "Successfully Created",
                site
            })
        })
        .catch(err => {
            if(err.code === 11000){
                res.status(500).json(
                    {
                        message: `Duplicate ${Object.keys(err.keyPattern)[0]}`,
                    }
                )
            }
            else{
                res.status(500).json(
                    {
                        message: `Some other unkown error`,
                        error: err
                    }
                )    
            }
        })
})

siteRouter.post('/update',(req,res) => {
    let {id, updates} = req.body;
    if(id === undefined || updates === undefined || id === null || updates === null){
        return res.status(400).json({message: "All required values not sent!"});
    }
    Site.findOneAndUpdate({_id: id}, updates, {new: true}, (err, doc) => {
        if(err){
            res.status(500).json({
                message: "Something went wrong",
                error: err
            })
        }
        console.log(doc);
        res.status(200).json({
            message: "Updated Successfully",
            site: doc
        })
    })
})

siteRouter.post('/delete', (req,res) => {
    let {id} = req.body;
    if(id == undefined){
        return res.status(400).json({message: "ID is required!"});
    }
    Site.findOneAndDelete({_id: id})
        .then(deletedSite => {
            if(deletedSite === null){
                return res.status(404).json({message: "ID Supplied not found!"})
            }
            return res.json({message: "Deleted Successfully", site: deletedSite});
        })
        .catch(err => {
            if(err.kind === "ObjectId") return res.status(404).json({message: "Bad ObjectID Sent!"});
            if(err.reason.type === "ReplicaSetNoPrimary") return res.status(500).json({message: "Could not connect!"});
            return res.status(500).json({message: "Something went wrong!", error: err});
        })
})

module.exports = siteRouter;