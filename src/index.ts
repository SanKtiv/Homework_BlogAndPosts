import {app} from './setting';
import {runDb} from "./repositories/mongodb-repository/db";

const ngrok = require('ngrok')
const port = process.env.PORT || 3000

const startApp = async () => {
    // await ngrok.connect(3000)
    await runDb()
    app.set('trust proxy', '127.0.0.1')
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()