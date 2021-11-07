import socket from "./controller/socket.js"
import events from "./controller/events.js"

// controlador de eventos del socket
socket.listener()

// controlador de eventos del dom
events.listener()