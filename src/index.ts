import {app} from './setting';
import {runDb} from "./repositories/mongodb-repository/db";
import ngrok from 'ngrok'

const port = process.env.PORT || 3000


const startApp = async () => {
    // const url = await ngrok.connect(3000)
    // console.log(url)
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()