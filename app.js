require('dotenv').config()
const Express = require('express')
const app = Express()
const dbConnection = require("./db")
app.use(require('./middleware/headers'));

app.use(Express.json())

const controllers = require("./controllers");
app.use("/user", controllers.userController)
app.use(require("./middleware/validateSession"))
app.use("/place", controllers.placeController)

dbConnection.authenticate()
    .then(() => dbConnection.sync({force:true}))
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`[Server]: App is listening on ${process.env.PORT}.`)
        })
    })
    .catch((err) => {
        console.log(`[Server]: Server crashed. Error = ${err} `)
    })
