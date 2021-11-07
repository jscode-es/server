// Load Node JS modules
import dotenv from "dotenv"
import path from "path"
import Process from "@controller/process"

// Escuchar processo
Process.listen()

const envFileName = `.env${process.env.NODE_ENV && `.${process.env.NODE_ENV}`}`
const pathToEnvFile = path.resolve(__dirname, '..', envFileName)

// Initialize configuration
dotenv.config({ path: pathToEnvFile })

// Quick directories
import "@controller/directory"
import Server from "@controller/server"

let { Types } = Server

new Server(Types.HTTPS)