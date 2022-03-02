const { DataTypes } = require("sequelize");
const db = require("../db");

const TrailModel = db.define("trails", {
    trailName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    length: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageURL: {
        type: DataTypes.STRING(1000),
        allowNull: true
    },
    ownerID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
})

module.exports = TrailModel