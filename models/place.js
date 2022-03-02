const { DataTypes } = require("sequelize");
const db = require("../db");

const PlaceModel = db.define("places", {
    placeName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    latitude: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    longitude: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    ownerID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
})

module.exports = PlaceModel