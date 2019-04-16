import { AuthenticationContext } from "adal-node";

import * as request from "request";

import { promisify } from "util";
import { environment } from "../../environment";


// const userId ="f15ff752-c431-41ed-8205-861ed1ca437a"
const b2cGraphRequest = request.defaults({
  baseUrl: `https://graph.windows.net/${environment.aadGraphApi.tenant}`
});
const { get } = b2cGraphRequest;
const [getPm] = [get].map(promisify);

export const b2cGraphGetPhoto = async (userId:string) => {
  const token: any = await getToken();
  return await getPm({
    auth: {
      bearer: token
    },
    encoding: null,
    qs: {'api-version':1.6},
    url: `/users/${userId}/thumbnailPhoto`
  });
};

export const b2cGraphUploadPhoto = async (userId:string,stream: any) => {
  const token: any = await getToken();

  const putRequest = b2cGraphRequest.put({
    auth: {
      bearer: token
    },
    qs: {'api-version':1.6},
    url: `/users/${userId}/thumbnailPhoto`,
  });

  stream.pipe(putRequest);

  return new Promise((resolve, reject) => {
    putRequest.on('response', (response: any) => resolve(response.statusCode));
  });
};

function getToken() {
  return new Promise((resolve, reject) => {
    const authContext = new AuthenticationContext(<string>environment.aadGraphApi.authorityUrl);
    authContext.acquireTokenWithClientCredentials(
      <string>environment.aadGraphApi.resource,
      <string>environment.aadGraphApi.applicationId,
      <string>environment.aadGraphApi.clientSecret,
      (err:any, tokenRes: any) => {
        if (err) {
          reject(err);
        }
        resolve(tokenRes.accessToken);
      }
    );
  });
}
