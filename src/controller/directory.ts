// ============================
// Directories
// ============================

const $ = process.env

// Cargar modulos de Node JS
import path from 'path'

// Method build directory
const _ = (...arg: any) => path.resolve(arg.join('/'))

// Configuración
$.root = process.cwd()

// Rutas de las carpetas
$.dist = _($.root, 'dist')
$.controller = _($.dist, 'controller')
$.services = _($.controller, 'services')
$.model = _($.dist, 'model')
$.public = _($.dist, 'public')
$.router = _($.dist, 'router')
$.view = _($.dist, 'view')