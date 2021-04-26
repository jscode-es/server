// Import to modules
import dotenv from "dotenv"

// Initialize settings
dotenv.config()

// Dynamic envioroment 
import "./dynamic_env"
import error from "./controller/error"
import server from "./controller/server"

// Module errors
error.listener()

// Launch server
new server()