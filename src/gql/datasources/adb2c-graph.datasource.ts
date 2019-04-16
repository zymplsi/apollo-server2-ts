import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";
import { AuthenticationContext } from "adal-node";
import { environment } from "../../environment";

class AdB2cGraphAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL =`https://graph.windows.net/${environment.aadGraphApi.tenant}`;
   
  }

  async willSendRequest(request: RequestOptions) {
    const token: any = await this.getToken();
    request.headers.set("Authorization", `Bearer ${token}`);
    request.params.set("api-version", "1.6");
  }

  async getUser(userId: string) {
    return  await this.get(`/users/${userId}`);  
  }

  private getToken() {
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
}

export default AdB2cGraphAPI;
