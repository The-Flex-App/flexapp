const axios = require('axios');
const debug = require('debug')('auth');
const config = require('../../config');
const qs = require('qs');
const jwt = require('jsonwebtoken');

const jwksUrl = `https://my-cognito-url.us-east-1.amazonaws.com/${config.cognito.cognitoPoolId}/.well-known/jwks.json`;

const client = jwksClient({
  cache: true,
  cacheMaxEntries: 5, // Default value
  cacheMaxAge: ms('10h'), // Default value
  strictSsl: true, // Default value
  jwksUri: jwksUrl,
});

function generateAuthToken(user) {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      bannerUrl: user.bannerUrl,
      isApproved: user.isApproved,
      role: user.role,
    },
    config.secret
  );
  return token;
}

async function awsCallTokenEndpoint(grantType, accessToken) {
  const data = {
    grant_type: grantType,
    client_id: config.cognito.clientId,
    code: accessToken,
    scope: 'profile',
    redirect_uri: config.cognito.redirectCallback,
  };

  const p = {
    method: 'post',
    url: `${config.cognito.domainUrl}/oauth2/token`,
    data: qs.stringify(data),

    auth: {
      username: config.cognito.clientId,
      password: config.cognito.secret,
    },
  };
  debug(`AWS oauth2/token request parameters: ${JSON.stringify(p)}`);
  const awsResponse = await axios(p);
  debug(`AWS oauth2/token response : ${JSON.stringify(awsResponse.data)}`);

  return awsResponse;
}

async function getEmailFromCode(code) {
  const awsAuthorizationCodeResponse = await awsCallTokenEndpoint(
    'authorization_code',
    code
  );

  const unverifiedDecodedAuthorizationCodeIdToken = jwt.decode(
    awsAuthorizationCodeResponse.data.id_token,
    {
      complete: true,
    }
  );
  const unverifiedDecodedAuthorizationCodeAccessToken = jwt.decode(
    awsAuthorizationCodeResponse.data.access_token,
    {
      complete: true,
    }
  );
  const unverifiedDecodedAuthorizationCodeRefreshToken = jwt.decode(
    awsAuthorizationCodeResponse.data.refresh_token,
    {
      complete: true,
    }
  );

  debug(
    `AWS oauth2/token authorization code response id_token decoded but inverified: ${JSON.stringify(
      unverifiedDecodedAuthorizationCodeIdToken
    )}`
  );
  debug(
    `AWS oauth2/token authorization code response access_token decoded but inverified: ${JSON.stringify(
      unverifiedDecodedAuthorizationCodeAccessToken
    )}`
  );
  debug(
    `AWS oauth2/token authorization code response refresh_token decoded but inverified: ${JSON.stringify(
      unverifiedDecodedAuthorizationCodeRefreshToken
    )}`
  );

  const { kid } = unverifiedDecodedAuthorizationCodeIdToken.header;

  async function getKey(kidId) {
    return new Promise((resolve, reject) => {
      client.getKeys((err, keys) => {
        const key1 = keys.find((k) => k.kid === kidId);
        resolve(key1);
      });
    });
  }

  const jwk = await getKey(kid);
  const pem = jwkToPem(jwk);
  const decodedIdToken = await jwt.verify(
    awsAuthorizationCodeResponse.data.id_token,
    pem,
    { algorithms: ['RS256'] }
  );
  debug(
    `Decoded and verified id token from aws ${JSON.stringify(decodedIdToken)}`
  );
  // Make sure that the profile checkbox is selected in the App client settings in cognito for the app. Otherwise you will get just the email
  const { email } = decodedIdToken;
  const { name } = decodedIdToken;
  const { family_name } = decodedIdToken;
  const returnObject = {
    email: email.toLowerCase(),
    firstName: name,
    lastName: family_name,
  };
  return returnObject;
}
