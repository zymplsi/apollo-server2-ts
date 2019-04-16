exports.id = "main";
exports.modules = {

/***/ "./src/gql/api/adb2c-graph-photo.api.ts":
/*!**********************************************!*\
  !*** ./src/gql/api/adb2c-graph-photo.api.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const adal_node_1 = __webpack_require__(/*! adal-node */ "adal-node");
const request = __importStar(__webpack_require__(/*! request */ "request"));
const util_1 = __webpack_require__(/*! util */ "util");
const environment_1 = __webpack_require__(/*! ../../environment */ "./src/environment.ts");
const b2cGraphRequest = request.defaults({
    baseUrl: `https://graph.windows.net/${environment_1.environment.aadGraphApi.tenant}`
});
const { get } = b2cGraphRequest;
const [getPm] = [get].map(util_1.promisify);
exports.b2cGraphGetPhoto = (userId) => __awaiter(this, void 0, void 0, function* () {
    const token = yield getToken();
    return yield getPm({
        auth: {
            bearer: token
        },
        encoding: null,
        qs: { 'api-version': 1.6 },
        url: `/users/${userId}/thumbnailPhoto`
    });
});
exports.b2cGraphUploadPhoto = (userId, stream) => __awaiter(this, void 0, void 0, function* () {
    const token = yield getToken();
    const putRequest = b2cGraphRequest.put({
        auth: {
            bearer: token
        },
        qs: { 'api-version': 1.6 },
        url: `/users/${userId}/thumbnailPhoto`,
    });
    stream.pipe(putRequest);
    return new Promise((resolve, reject) => {
        putRequest.on('response', (response) => resolve(response.statusCode));
    });
});
function getToken() {
    return new Promise((resolve, reject) => {
        const authContext = new adal_node_1.AuthenticationContext(environment_1.environment.aadGraphApi.authorityUrl);
        authContext.acquireTokenWithClientCredentials(environment_1.environment.aadGraphApi.resource, environment_1.environment.aadGraphApi.applicationId, environment_1.environment.aadGraphApi.clientSecret, (err, tokenRes) => {
            if (err) {
                reject(err);
            }
            resolve(tokenRes.accessToken);
        });
    });
}


/***/ }),

/***/ "./src/gql/schemas/adb2c-graph/adb2c-graph-photo.gql.schema.ts":
/*!*********************************************************************!*\
  !*** ./src/gql/schemas/adb2c-graph/adb2c-graph-photo.gql.schema.ts ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_upload_1 = __webpack_require__(/*! graphql-upload */ "graphql-upload");
const adb2c_graph_photo_api_1 = __webpack_require__(/*! ../../api/adb2c-graph-photo.api */ "./src/gql/api/adb2c-graph-photo.api.ts");
exports.schema = [
    `
  scalar Upload

  type Image {
    imageBase64 : String!
  }

  type UploadResult {
    result : String!
  }

  extend type Query {
    userAvatar: Image
  }

  extend type Mutation {
    avatarUpload(file: Upload!): UploadResult
  }

`
];
exports.typeResolvers = {
    Upload: graphql_upload_1.GraphQLUpload
};
exports.queryResolvers = {
    userAvatar: (_, args, { oid }) => __awaiter(this, void 0, void 0, function* () {
        const getPhotoResult = yield adb2c_graph_photo_api_1.b2cGraphGetPhoto(oid);
        const imageFile = getPhotoResult.body;
        const contentType = getPhotoResult.headers["content-type"];
        const bufferBase64 = Buffer.from(imageFile).toString("base64");
        return { imageBase64: `data:${contentType};base64, ${bufferBase64}` };
    })
};
const processUpload = (userId, upload) => __awaiter(this, void 0, void 0, function* () {
    const { createReadStream } = yield upload;
    const stream = createReadStream();
    const b2cGraphUploadPhotoResult = yield adb2c_graph_photo_api_1.b2cGraphUploadPhoto(userId, stream);
    return { result: b2cGraphUploadPhotoResult };
});
exports.mutationResolvers = {
    avatarUpload: (_, { file }, { oid }) => {
        return processUpload(oid, file);
    }
};


/***/ })

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvZ3FsL2FwaS9hZGIyYy1ncmFwaC1waG90by5hcGkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dxbC9zY2hlbWFzL2FkYjJjLWdyYXBoL2FkYjJjLWdyYXBoLXBob3RvLmdxbC5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNFQUFrRDtBQUVsRCw0RUFBbUM7QUFFbkMsdURBQWlDO0FBQ2pDLDJGQUFnRDtBQUloRCxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0lBQ3ZDLE9BQU8sRUFBRSw2QkFBNkIseUJBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO0NBQ3ZFLENBQUMsQ0FBQztBQUNILE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxlQUFlLENBQUM7QUFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFTLENBQUMsQ0FBQztBQUV4Qix3QkFBZ0IsR0FBRyxDQUFPLE1BQWEsRUFBRSxFQUFFO0lBQ3RELE1BQU0sS0FBSyxHQUFRLE1BQU0sUUFBUSxFQUFFLENBQUM7SUFDcEMsT0FBTyxNQUFNLEtBQUssQ0FBQztRQUNqQixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsS0FBSztTQUNkO1FBQ0QsUUFBUSxFQUFFLElBQUk7UUFDZCxFQUFFLEVBQUUsRUFBQyxhQUFhLEVBQUMsR0FBRyxFQUFDO1FBQ3ZCLEdBQUcsRUFBRSxVQUFVLE1BQU0saUJBQWlCO0tBQ3ZDLENBQUMsQ0FBQztBQUNMLENBQUMsRUFBQztBQUVXLDJCQUFtQixHQUFHLENBQU8sTUFBYSxFQUFDLE1BQVcsRUFBRSxFQUFFO0lBQ3JFLE1BQU0sS0FBSyxHQUFRLE1BQU0sUUFBUSxFQUFFLENBQUM7SUFFcEMsTUFBTSxVQUFVLEdBQUcsZUFBZSxDQUFDLEdBQUcsQ0FBQztRQUNyQyxJQUFJLEVBQUU7WUFD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ZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEF1dGhlbnRpY2F0aW9uQ29udGV4dCB9IGZyb20gXCJhZGFsLW5vZGVcIjtcblxuaW1wb3J0ICogYXMgcmVxdWVzdCBmcm9tIFwicmVxdWVzdFwiO1xuXG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tIFwidXRpbFwiO1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tIFwiLi4vLi4vZW52aXJvbm1lbnRcIjtcblxuXG4vLyBjb25zdCB1c2VySWQgPVwiZjE1ZmY3NTItYzQzMS00MWVkLTgyMDUtODYxZWQxY2E0MzdhXCJcbmNvbnN0IGIyY0dyYXBoUmVxdWVzdCA9IHJlcXVlc3QuZGVmYXVsdHMoe1xuICBiYXNlVXJsOiBgaHR0cHM6Ly9ncmFwaC53aW5kb3dzLm5ldC8ke2Vudmlyb25tZW50LmFhZEdyYXBoQXBpLnRlbmFudH1gXG59KTtcbmNvbnN0IHsgZ2V0IH0gPSBiMmNHcmFwaFJlcXVlc3Q7XG5jb25zdCBbZ2V0UG1dID0gW2dldF0ubWFwKHByb21pc2lmeSk7XG5cbmV4cG9ydCBjb25zdCBiMmNHcmFwaEdldFBob3RvID0gYXN5bmMgKHVzZXJJZDpzdHJpbmcpID0+IHtcbiAgY29uc3QgdG9rZW46IGFueSA9IGF3YWl0IGdldFRva2VuKCk7XG4gIHJldHVybiBhd2FpdCBnZXRQbSh7XG4gICAgYXV0aDoge1xuICAgICAgYmVhcmVyOiB0b2tlblxuICAgIH0sXG4gICAgZW5jb2Rpbmc6IG51bGwsXG4gICAgcXM6IHsnYXBpLXZlcnNpb24nOjEuNn0sXG4gICAgdXJsOiBgL3VzZXJzLyR7dXNlcklkfS90aHVtYm5haWxQaG90b2BcbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgYjJjR3JhcGhVcGxvYWRQaG90byA9IGFzeW5jICh1c2VySWQ6c3RyaW5nLHN0cmVhbTogYW55KSA9PiB7XG4gIGNvbnN0IHRva2VuOiBhbnkgPSBhd2FpdCBnZXRUb2tlbigpO1xuXG4gIGNvbnN0IHB1dFJlcXVlc3QgPSBiMmNHcmFwaFJlcXVlc3QucHV0KHtcbiAgICBhdXRoOiB7XG4gICAgICBiZWFyZXI6IHRva2VuXG4gICAgfSxcbiAgICBxczogeydhcGktdmVyc2lvbic6MS42fSxcbiAgICB1cmw6IGAvdXNlcnMvJHt1c2VySWR9L3RodW1ibmFpbFBob3RvYCxcbiAgfSk7XG5cbiAgc3RyZWFtLnBpcGUocHV0UmVxdWVzdCk7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBwdXRSZXF1ZXN0Lm9uKCdyZXNwb25zZScsIChyZXNwb25zZTogYW55KSA9PiByZXNvbHZlKHJlc3BvbnNlLnN0YXR1c0NvZGUpKTtcbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBnZXRUb2tlbigpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBhdXRoQ29udGV4dCA9IG5ldyBBdXRoZW50aWNhdGlvbkNvbnRleHQoPHN0cmluZz5lbnZpcm9ubWVudC5hYWRHcmFwaEFwaS5hdXRob3JpdHlVcmwpO1xuICAgIGF1dGhDb250ZXh0LmFjcXVpcmVUb2tlbldpdGhDbGllbnRDcmVkZW50aWFscyhcbiAgICAgIDxzdHJpbmc+ZW52aXJvbm1lbnQuYWFkR3JhcGhBcGkucmVzb3VyY2UsXG4gICAgICA8c3RyaW5nPmVudmlyb25tZW50LmFhZEdyYXBoQXBpLmFwcGxpY2F0aW9uSWQsXG4gICAgICA8c3RyaW5nPmVudmlyb25tZW50LmFhZEdyYXBoQXBpLmNsaWVudFNlY3JldCxcbiAgICAgIChlcnI6YW55LCB0b2tlblJlczogYW55KSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKHRva2VuUmVzLmFjY2Vzc1Rva2VuKTtcbiAgICAgIH1cbiAgICApO1xuICB9KTtcbn1cbiIsImltcG9ydCB7IEdyYXBoUUxVcGxvYWQgfSBmcm9tIFwiZ3JhcGhxbC11cGxvYWRcIjtcbmltcG9ydCB7IGIyY0dyYXBoR2V0UGhvdG8sIGIyY0dyYXBoVXBsb2FkUGhvdG8gfSBmcm9tIFwiLi4vLi4vYXBpL2FkYjJjLWdyYXBoLXBob3RvLmFwaVwiO1xuXG5cbmV4cG9ydCBjb25zdCBzY2hlbWEgPSBbXG4gIGBcbiAgc2NhbGFyIFVwbG9hZFxuXG4gIHR5cGUgSW1hZ2Uge1xuICAgIGltYWdlQmFzZTY0IDogU3RyaW5nIVxuICB9XG5cbiAgdHlwZSBVcGxvYWRSZXN1bHQge1xuICAgIHJlc3VsdCA6IFN0cmluZyFcbiAgfVxuXG4gIGV4dGVuZCB0eXBlIFF1ZXJ5IHtcbiAgICB1c2VyQXZhdGFyOiBJbWFnZVxuICB9XG5cbiAgZXh0ZW5kIHR5cGUgTXV0YXRpb24ge1xuICAgIGF2YXRhclVwbG9hZChmaWxlOiBVcGxvYWQhKTogVXBsb2FkUmVzdWx0XG4gIH1cblxuYFxuXTtcblxuZXhwb3J0IGNvbnN0IHR5cGVSZXNvbHZlcnMgPSB7XG4gIFVwbG9hZDogR3JhcGhRTFVwbG9hZFxufTtcbmV4cG9ydCBjb25zdCBxdWVyeVJlc29sdmVycyA9IHtcbiAgdXNlckF2YXRhcjogYXN5bmMgKF86IGFueSwgYXJnczogYW55LCB7IG9pZCB9OiBhbnkpID0+IHtcbiAgICBjb25zdCBnZXRQaG90b1Jlc3VsdCA9IGF3YWl0IGIyY0dyYXBoR2V0UGhvdG8ob2lkKTtcbiAgICBjb25zdCBpbWFnZUZpbGUgPSBnZXRQaG90b1Jlc3VsdC5ib2R5O1xuICAgIGNvbnN0IGNvbnRlbnRUeXBlID0gZ2V0UGhvdG9SZXN1bHQuaGVhZGVyc1tcImNvbnRlbnQtdHlwZVwiXTtcbiAgICBjb25zdCBidWZmZXJCYXNlNjQgPSBCdWZmZXIuZnJvbShpbWFnZUZpbGUpLnRvU3RyaW5nKFwiYmFzZTY0XCIpO1xuICAgIHJldHVybiB7IGltYWdlQmFzZTY0OiBgZGF0YToke2NvbnRlbnRUeXBlfTtiYXNlNjQsICR7YnVmZmVyQmFzZTY0fWAgfTtcbiAgfVxufTtcblxuY29uc3QgcHJvY2Vzc1VwbG9hZCA9IGFzeW5jICh1c2VySWQ6IHN0cmluZywgdXBsb2FkOiBhbnkpID0+IHtcbiAgY29uc3QgeyBjcmVhdGVSZWFkU3RyZWFtIH0gPSBhd2FpdCB1cGxvYWQ7XG4gIGNvbnN0IHN0cmVhbSA9IGNyZWF0ZVJlYWRTdHJlYW0oKTtcbiAgY29uc3QgYjJjR3JhcGhVcGxvYWRQaG90b1Jlc3VsdCA9IGF3YWl0IGIyY0dyYXBoVXBsb2FkUGhvdG8odXNlcklkLCBzdHJlYW0pO1xuICByZXR1cm4geyByZXN1bHQ6IGIyY0dyYXBoVXBsb2FkUGhvdG9SZXN1bHQgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBtdXRhdGlvblJlc29sdmVycyA9IHtcbiAgYXZhdGFyVXBsb2FkOiAoXzogYW55LCB7IGZpbGUgfTogYW55LCB7IG9pZCB9OiBhbnkpID0+IHtcbiAgICByZXR1cm4gcHJvY2Vzc1VwbG9hZChvaWQsIGZpbGUpO1xuICB9XG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==