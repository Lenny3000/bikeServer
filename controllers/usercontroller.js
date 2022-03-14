const router = require('express').Router();
const { UserModel } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validateJWT = require("../middleware/validateSession")

router.post("/register", async (req, res) => {

    const { firstName, lastName, email, password, isAdmin } = req.body;
    try {
        const user = await UserModel.create({
            firstName,
            lastName,
            email,
            password: bcrypt.hashSync(password, 13),
            isAdmin
        });

        let token = jwt.sign({ id: user.id }, process.env.JWT_KEY, { expiresIn: 60 * 60 * 24 })
        res.status(201).json({
            message: "User successfully registered",
            user: "user", user,
            sessionToken: token
        })
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already in use",
            })
        } else {
            res.status(500).json({
                message: "Failed to register user",
                err: err.message
            })
        }
    }
})

router.post("/login", async (req, res) => {
    let { email, password } = req.body;

    try {
        let loginUser = await UserModel.findOne({
            where: {
                email: email
            }
        })

        if (loginUser) {
            let passwordComparison = await bcrypt.compare(password, loginUser.password);

            if (passwordComparison) {
                let token = jwt.sign({ id: loginUser.id }, process.env.JWT_KEY, { expiresIn: 60 * 60 * 24 })
                res.status(200).json({
                    user: loginUser,
                    message: "Login successful",
                    sessionToken: token
                })
            } else {
                res.status(401).json({
                    message: "Incorrect email or password",
                })
            }
        }
    } catch (err) {
        res.status(500).json({
            message: "Failed to login",
        })
    }

})

router.get("/userInfo/:id", validateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const user = await UserModel.findAll({
           where: {
               id: id
           }
        });

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

router.get("/userInfo/", validateJWT, async (req, res) => {
    // const allUsers = await UserModel.findAll();
    try {
        const user = await UserModel.findAll({
           where: {
            //    isAdmin: true
           }
        });

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

router.put("/:id", validateJWT, async (req, res) => {
  const { password } = req.body;
  if (req.user.isAdmin == true) {
    try {
      await UserModel.update(
        { password: bcrypt.hashSync(password, 13) },
        { where: { id: req.params.id }, returning: true }
      ).then((result) => {
        res.status(200).json({
          message: "Password successfully updated.",
          updatedPassword: result,
        });
      });
    } catch (err) {
      res.status(500).json({
        message: `Failed to update password ${err}`,
      });
    }
  } else {
    res.status(500).json({
      message: `Failed to update password `,
    });
  }
});

module.exports = router;