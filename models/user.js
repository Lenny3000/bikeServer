const { DataTypes } = require("sequelize");
const db = require("../db");

const UserModel = db.define("user", {
    // ownerId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    firstName: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(1000),
        allowNull: false,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
})

module.exports = UserModel;