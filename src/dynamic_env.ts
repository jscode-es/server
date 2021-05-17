// Enviorenment system
const env = process.env

env.CERT      = env.NODE_ENV == 'development' ? env.CERT_DEV : env.CERT_PRO
env.CERT_KEY  = env.NODE_ENV == 'development' ? env.CERT_KEY_DEV : env.CERT_KEY_PRO
env.CERT_CA   = env.NODE_ENV == 'development' ? env.CERT_CA_DEV : env.CERT_CA_PRO

env.DB_USER   = env.NODE_ENV == 'development' ? env.DB_USER_DEV : env.DB_USER_PRO
env.DB_PASS   = env.NODE_ENV == 'development' ? env.DB_PASS_DEV : env.DB_PASS_PRO
env.DB_TABLE  = env.NODE_ENV == 'development' ? env.DB_TABLE_DEV : env.DB_TABLE_PRO

env.IP        = env.NODE_ENV == 'development' ? env.IP_DEV : env.IP_PRO