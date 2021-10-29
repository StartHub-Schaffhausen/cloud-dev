/* eslint-disable linebreak-style */
/* eslint-disable max-len */
export const configurationSHtest = {
  issuer: "https://gateway.test.eid.sh.ch",
  authorization_endpoint: "https://gateway.test.eid.sh.ch/authorize",
  token_endpoint: "https://gateway.test.eid.sh.ch/token",
  userinfo_endpoint: "https://gateway.test.eid.sh.ch/userinfo",
  end_session_endpoint: "https://gateway.test.eid.sh.ch/end-session",
  introspection_endpoint: "https://gateway.test.eid.sh.ch/introspect",
  response_types_supported: ["code", "id_token", "id_token token", "code token", "code id_token", "code id_token token"],
  jwks_uri: "https://gateway.test.eid.sh.ch/jwks",
  id_token_signing_alg_values_supported: ["HS256", "RS256"],
  subject_types_supported: ["public"],
  token_endpoint_auth_methods_supported: ["client_secret_post", "client_secret_basic"],
};
// https://gateway.test.eid.sh.ch/.well-known/openid-configuration
