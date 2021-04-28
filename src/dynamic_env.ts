// Enviorenment system
const $ = process.env

$.CERT      = $.NODE_ENV == 'development' ? $.CERT_DEV : $.CERT_PRO
$.CERT_KEY  = $.NODE_ENV == 'development' ? $.CERT_KEY_DEV : $.CERT_KEY_PRO
$.CERT_CA   = $.NODE_ENV == 'development' ? $.CERT_CA_DEV : $.CERT_CA_PRO

$.IP      = $.NODE_ENV == 'development' ? $.IP_DEV : $.IP_PRO