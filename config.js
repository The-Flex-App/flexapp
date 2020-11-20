const path = require('path');

const dotEnvPath = path.resolve('./.env');
const dotenv = require('dotenv');
dotenv.config({ path: dotEnvPath });

const config = {};

config.secret = process.env.SECRET;
config.port = process.env.PORT || 3001;
config.cognito = {};

config.cognito.idenityPoolId = process.env.COGNITO_IDENTITY_POOL_ID;
config.cognito.clientId = process.env.COGNITO_CLIENT_ID;
config.cognito.clientIdForSignUp = process.env.COGNITO_CLIENT_ID_FOR_SIGN_UP;
config.cognito.secret = process.env.COGNITO_SECRET;
config.cognito.domainUrl = process.env.COGNITO_DOMAIN;
config.cognito.redirectCallback = process.env.COGNITO_CALLBACK_URL;
config.cognito.cognitoPoolId = process.env.COGNITO_POOL_ID;

module.exports = config;
