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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvZ3FsL2FwaS9hZGIyYy1ncmFwaC1waG90by5hcGkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dxbC9zY2hlbWFzL2FkYjJjLWdyYXBoL2FkYjJjLWdyYXBoLXBob3RvLmdxbC5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNFQUFrRDtBQUVsRCw0RUFBbUM7QUFHbkMsdURBQWlDO0FBQ2pDLDJGQUFnRDtBQVdoRCxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0lBQ3ZDLE9BQU8sRUFBRSw2QkFBNkIseUJBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO0NBQ3ZFLENBQUMsQ0FBQztBQUNILE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxlQUFlLENBQUM7QUFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFTLENBQUMsQ0FBQztBQUV4Qix3QkFBZ0IsR0FBRyxDQUFPLE1BQWEsRUFBRSxFQUFFO0lBQ3RELE1BQU0sS0FBSyxHQUFRLE1BQU0sUUFBUSxFQUFFLENBQUM7SUFDcEMsT0FBTyxNQUFNLEtBQUssQ0FBQztRQUNqQixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsS0FBSztTQUNkO1FBQ0QsUUFBUSxFQUFFLElBQUk7UUFDZCxFQUFFLEVBQUUsRUFBQyxhQUFhLEVBQUMsR0FBRyxFQUFDO1FBQ3ZCLEdBQUcsRUFBRSxVQUFVLE1BQU0saUJBQWlCO0tBQ3ZDLENBQUMsQ0FBQztBQUNMLENBQUMsRUFBQztBQUVXLDJCQUFtQixHQUFHLENBQU8sTUFBYSxFQUFDLE1BQVcsRUFBRSxFQUFFO0lBQ3JFLE1BQU0sS0FBSyxHQUFRLE1BQU0sUUFBUSxFQUFFLENBQUM7SUFFcEMsTUFBTSxVQUFVLEdBQUcsZUFBZSxDQUFDLEdBQUcsQ0FBQztRQUNyQyxJQUFJLEVBQUU7WUFD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ZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEF1dGhlbnRpY2F0aW9uQ29udGV4dCB9IGZyb20gXCJhZGFsLW5vZGVcIjtcblxuaW1wb3J0ICogYXMgcmVxdWVzdCBmcm9tIFwicmVxdWVzdFwiO1xuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5cbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gXCJ1dGlsXCI7XG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gXCIuLi8uLi9lbnZpcm9ubWVudFwiO1xuXG4vLyBjb25zdCBhdXRob3JpdHlIb3N0VXJsID0gXCJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb21cIjtcbi8vIGNvbnN0IHRlbmFudCA9IFwid3dmc2doYWx0cHJvai5vbm1pY3Jvc29mdC5jb21cIjsgLy8gQUFEIFRlbmFudCBuYW1lLlxuLy8gY29uc3QgYXV0aG9yaXR5VXJsID0gYXV0aG9yaXR5SG9zdFVybCArIFwiL1wiICsgdGVuYW50O1xuLy8gY29uc3QgYXBwbGljYXRpb25JZCA9IFwiYTBjZjMyNzUtNTM5ZC00NGRjLTlhYjItYzk2NTExNDhmM2I4XCI7IC8vIEFwcGxpY2F0aW9uIElkIG9mIGFwcCByZWdpc3RlcmVkIHVuZGVyIEFBRC5cbi8vIGNvbnN0IGNsaWVudFNlY3JldCA9IFwiZTBURkZKUXFKN2U0dlhKUFlOUFdCQ0hXOGs5cmF5N1FVbTJxWDNtWjdBQT1cIjsgLy8gU2VjcmV0IGdlbmVyYXRlZCBmb3IgYXBwLiBSZWFkIHRoaXMgZW52aXJvbm1lbnQgdmFyaWFibGUuXG4vLyBjb25zdCByZXNvdXJjZSA9IFwiMDAwMDAwMDItMDAwMC0wMDAwLWMwMDAtMDAwMDAwMDAwMDAwXCI7IC8vIFVSSSB0aGF0IGlkZW50aWZpZXMgdGhlIHJlc291cmNlIGZvciB3aGljaCB0aGUgdG9rZW4gaXMgdmFsaWQuXG5cblxuLy8gY29uc3QgdXNlcklkID1cImYxNWZmNzUyLWM0MzEtNDFlZC04MjA1LTg2MWVkMWNhNDM3YVwiXG5jb25zdCBiMmNHcmFwaFJlcXVlc3QgPSByZXF1ZXN0LmRlZmF1bHRzKHtcbiAgYmFzZVVybDogYGh0dHBzOi8vZ3JhcGgud2luZG93cy5uZXQvJHtlbnZpcm9ubWVudC5hYWRHcmFwaEFwaS50ZW5hbnR9YFxufSk7XG5jb25zdCB7IGdldCB9ID0gYjJjR3JhcGhSZXF1ZXN0O1xuY29uc3QgW2dldFBtXSA9IFtnZXRdLm1hcChwcm9taXNpZnkpO1xuXG5leHBvcnQgY29uc3QgYjJjR3JhcGhHZXRQaG90byA9IGFzeW5jICh1c2VySWQ6c3RyaW5nKSA9PiB7XG4gIGNvbnN0IHRva2VuOiBhbnkgPSBhd2FpdCBnZXRUb2tlbigpO1xuICByZXR1cm4gYXdhaXQgZ2V0UG0oe1xuICAgIGF1dGg6IHtcbiAgICAgIGJlYXJlcjogdG9rZW5cbiAgICB9LFxuICAgIGVuY29kaW5nOiBudWxsLFxuICAgIHFzOiB7J2FwaS12ZXJzaW9uJzoxLjZ9LFxuICAgIHVybDogYC91c2Vycy8ke3VzZXJJZH0vdGh1bWJuYWlsUGhvdG9gXG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGIyY0dyYXBoVXBsb2FkUGhvdG8gPSBhc3luYyAodXNlcklkOnN0cmluZyxzdHJlYW06IGFueSkgPT4ge1xuICBjb25zdCB0b2tlbjogYW55ID0gYXdhaXQgZ2V0VG9rZW4oKTtcblxuICBjb25zdCBwdXRSZXF1ZXN0ID0gYjJjR3JhcGhSZXF1ZXN0LnB1dCh7XG4gICAgYXV0aDoge1xuICAgICAgYmVhcmVyOiB0b2tlblxuICAgIH0sXG4gICAgcXM6IHsnYXBpLXZlcnNpb24nOjEuNn0sXG4gICAgdXJsOiBgL3VzZXJzLyR7dXNlcklkfS90aHVtYm5haWxQaG90b2AsXG4gIH0pO1xuXG4gIHN0cmVhbS5waXBlKHB1dFJlcXVlc3QpO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgcHV0UmVxdWVzdC5vbigncmVzcG9uc2UnLCAocmVzcG9uc2U6IGFueSkgPT4gcmVzb2x2ZShyZXNwb25zZS5zdGF0dXNDb2RlKSk7XG4gIH0pO1xufTtcblxuZnVuY3Rpb24gZ2V0VG9rZW4oKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgYXV0aENvbnRleHQgPSBuZXcgQXV0aGVudGljYXRpb25Db250ZXh0KDxzdHJpbmc+ZW52aXJvbm1lbnQuYWFkR3JhcGhBcGkuYXV0aG9yaXR5VXJsKTtcbiAgICBhdXRoQ29udGV4dC5hY3F1aXJlVG9rZW5XaXRoQ2xpZW50Q3JlZGVudGlhbHMoXG4gICAgICA8c3RyaW5nPmVudmlyb25tZW50LmFhZEdyYXBoQXBpLnJlc291cmNlLFxuICAgICAgPHN0cmluZz5lbnZpcm9ubWVudC5hYWRHcmFwaEFwaS5hcHBsaWNhdGlvbklkLFxuICAgICAgPHN0cmluZz5lbnZpcm9ubWVudC5hYWRHcmFwaEFwaS5jbGllbnRTZWNyZXQsXG4gICAgICAoZXJyOmFueSwgdG9rZW5SZXM6IGFueSkgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZSh0b2tlblJlcy5hY2Nlc3NUb2tlbik7XG4gICAgICB9XG4gICAgKTtcbiAgfSk7XG59XG5cbi8vIGIyY0dyYXBoR2V0UGhvdG8oKTtcblxuLy8gYjJjR3JhcGhVcGxvYWRQaG90bygpO1xuIiwiaW1wb3J0IHsgR3JhcGhRTFVwbG9hZCB9IGZyb20gXCJncmFwaHFsLXVwbG9hZFwiO1xuaW1wb3J0IHsgYjJjR3JhcGhHZXRQaG90bywgYjJjR3JhcGhVcGxvYWRQaG90byB9IGZyb20gXCIuLi8uLi9hcGkvYWRiMmMtZ3JhcGgtcGhvdG8uYXBpXCI7XG5cblxuZXhwb3J0IGNvbnN0IHNjaGVtYSA9IFtcbiAgYFxuICBzY2FsYXIgVXBsb2FkXG5cbiAgdHlwZSBJbWFnZSB7XG4gICAgaW1hZ2VCYXNlNjQgOiBTdHJpbmchXG4gIH1cblxuICB0eXBlIFVwbG9hZFJlc3VsdCB7XG4gICAgcmVzdWx0IDogU3RyaW5nIVxuICB9XG5cbiAgZXh0ZW5kIHR5cGUgUXVlcnkge1xuICAgIHVzZXJBdmF0YXI6IEltYWdlXG4gIH1cblxuICBleHRlbmQgdHlwZSBNdXRhdGlvbiB7XG4gICAgYXZhdGFyVXBsb2FkKGZpbGU6IFVwbG9hZCEpOiBVcGxvYWRSZXN1bHRcbiAgfVxuXG5gXG5dO1xuXG5leHBvcnQgY29uc3QgdHlwZVJlc29sdmVycyA9IHtcbiAgVXBsb2FkOiBHcmFwaFFMVXBsb2FkXG59O1xuZXhwb3J0IGNvbnN0IHF1ZXJ5UmVzb2x2ZXJzID0ge1xuICB1c2VyQXZhdGFyOiBhc3luYyAoXzogYW55LCBhcmdzOiBhbnksIHsgb2lkIH06IGFueSkgPT4ge1xuICAgIGNvbnN0IGdldFBob3RvUmVzdWx0ID0gYXdhaXQgYjJjR3JhcGhHZXRQaG90byhvaWQpO1xuICAgIGNvbnN0IGltYWdlRmlsZSA9IGdldFBob3RvUmVzdWx0LmJvZHk7XG4gICAgY29uc3QgY29udGVudFR5cGUgPSBnZXRQaG90b1Jlc3VsdC5oZWFkZXJzW1wiY29udGVudC10eXBlXCJdO1xuICAgIGNvbnN0IGJ1ZmZlckJhc2U2NCA9IEJ1ZmZlci5mcm9tKGltYWdlRmlsZSkudG9TdHJpbmcoXCJiYXNlNjRcIik7XG4gICAgcmV0dXJuIHsgaW1hZ2VCYXNlNjQ6IGBkYXRhOiR7Y29udGVudFR5cGV9O2Jhc2U2NCwgJHtidWZmZXJCYXNlNjR9YCB9O1xuICB9XG59O1xuXG5jb25zdCBwcm9jZXNzVXBsb2FkID0gYXN5bmMgKHVzZXJJZDogc3RyaW5nLCB1cGxvYWQ6IGFueSkgPT4ge1xuICBjb25zdCB7IGNyZWF0ZVJlYWRTdHJlYW0gfSA9IGF3YWl0IHVwbG9hZDtcbiAgY29uc3Qgc3RyZWFtID0gY3JlYXRlUmVhZFN0cmVhbSgpO1xuICBjb25zdCBiMmNHcmFwaFVwbG9hZFBob3RvUmVzdWx0ID0gYXdhaXQgYjJjR3JhcGhVcGxvYWRQaG90byh1c2VySWQsIHN0cmVhbSk7XG4gIHJldHVybiB7IHJlc3VsdDogYjJjR3JhcGhVcGxvYWRQaG90b1Jlc3VsdCB9O1xufTtcblxuZXhwb3J0IGNvbnN0IG11dGF0aW9uUmVzb2x2ZXJzID0ge1xuICBhdmF0YXJVcGxvYWQ6IChfOiBhbnksIHsgZmlsZSB9OiBhbnksIHsgb2lkIH06IGFueSkgPT4ge1xuICAgIHJldHVybiBwcm9jZXNzVXBsb2FkKG9pZCwgZmlsZSk7XG4gIH1cbn07XG4iXSwic291cmNlUm9vdCI6IiJ9