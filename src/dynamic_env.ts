// Enviorenment system
const $ = process.env

$.CERT      = $.NODE_ENV == 'development' ? $.CERT_DEV : $.CERT_PRO
$.CERT_KEY  = $.NODE_ENV == 'development' ? $.CERT_KEY_DEV : $.CERT_KEY_PRO
$.CERT_CA   = $.NODE_ENV == 'development' ? $.CERT_CA_DEV : $.CERT_CA_PRO

$.DB_USER   = $.NODE_ENV == 'development' ? $.DB_USER_DEV : $.DB_USER_PRO
$.DB_PASS   = $.NODE_ENV == 'development' ? $.DB_PASS_DEV : $.DB_PASS_PRO
$.DB_TABLE  = $.NODE_ENV == 'development' ? $.DB_TABLE_DEV : $.DB_TABLE_PRO

$.IP        = $.NODE_ENV == 'development' ? $.IP_DEV : $.IP_PRO