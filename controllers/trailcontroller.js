const Express = require('express');
const router = Express.Router();
const { TrailModel } = require("../models")

router.get("/get", async (req, res) => {
    try{
        const allTrail = await TrailModel.findAll()
        res.status(200).json(allTrail)
    } catch(err) {
        res.status(500).json({
            error:err
        })
    }
})

router.post("/create", async (req, res) => {

    try {
        const createTrail = await TrailModel.create({
            trailName: req.body.trailName,
            length: req.body.length,
            description: req.body.description,
            imageURL: req.body.imageURL,
            ownerID: req.user.id
        })

        res.status(201).json({
            message: "Trail successfully created",
            createTrail
        })
    } catch(err) {
        res.status(500).json({
            message: `Failed to create trail ${err}`
        })
    }
})

router.get("/ownerID",/*validateJWT,*/ async (req, res) => {
    const { id } = req.user
    try {
        const myLogs = await TrailModel.findAll({
            where: {
                ownerID: id
            }
        })
        res.status(200).json(myLogs)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

router.put("/:id", async (req, res) => {
    const {
        trailName,
        length,
        description,
        imageURL,
    } = req.body

    try {
        await TrailModel.update(
            { trailName, length, description, imageURL }, 
            { where: { id: req.params.id }, returning: true }
        )
        .then((result) => {
            res.status(200).json({
                message: "Trail successfully updated.",
                updatedTrail: result
            })
        })
    } catch(err) {
        res.status(500).json({
            message: `Failed to update trail ${err}`
        })
    }
})

router.delete("/:id", async (req, res) => {

    try {
        await TrailModel.destroy({
            where: { id: req.params.id }
        })
        
        res.status(200).json({
            message: "Trail deleted",
        })
        
    } catch(err) {
        res.status(500).json({
            message: `Failed to delete trail ${err}`
        })
    }
})


module.exports = router;