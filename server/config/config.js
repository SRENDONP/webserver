//==============================
//Puerto
//==============================
process.env.PORT = process.env.PORT || 3000;

//==============================
//Vencimiento de Token
//==============================
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

//==============================
//SEED de autenticacion
//==============================
process.env.SEED = process.env.SEED || 'este_es_seed_desarrollo'

//==============================
//Google Client
//==============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '146778178117-d0q83qtlna6k307u9sf2cp74q5n08oj2.apps.googleusercontent.com'
