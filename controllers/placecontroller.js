const Express = require('express');
const router = Express.Router();
const { PlaceModel } = require("../models")

router.get("/get", async (req, res) => {
    try{
        const allPlace = await PlaceModel.findAll()
        res.status(200).json(allPlace)
    } catch(err) {
        res.status(500).json({
            error:err
        })
    }
})

router.post("/create", async (req, res) => {

    try {
        const createPlace = await PlaceModel.create({
            placeName: req.body.placeName,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            ownerID: req.user.id
        })

        res.status(201).json({
            message: "Place successfully created",
            createPlace
        })
    } catch(err) {
        res.status(500).json({
            message: `Failed to create place ${err}`
        })
    }
})

router.get("/ownerID",/*validateJWT,*/ async (req, res) => {
    const { id } = req.user
    try {
        const myLogs = await PlaceModel.findAll({
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
        category,
        name,
        year,
        model,
        serial,
        imgURL,
        value,
    } = req.body

    try {
        await PlaceModel.update(
            { category, name, year, model, serial, imgURL, value }, 
            { where: { id: req.params.id }, returning: true }
        )
        .then((result) => {
            res.status(200).json({
                message: "Place successfully updated.",
                updatedPlace: result
            })
        })
    } catch(err) {
        res.status(500).json({
            message: `Failed to update place ${err}`
        })
    }
})

router.delete("/:id", async (req, res) => {

    try {
        await PlaceModel.destroy({
            where: { id: req.params.id }
        })
        
        res.status(200).json({
            message: "Place deleted",
        })
        
    } catch(err) {
        res.status(500).json({
            message: `Failed to delete place ${err}`
        })
    }
})


module.exports = router;