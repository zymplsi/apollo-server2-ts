exports.id = "main";
exports.modules = {

/***/ "./src/gql/schemas/adb2c-graph/adb2c-graph-user.gql.schema.ts":
/*!********************************************************************!*\
  !*** ./src/gql/schemas/adb2c-graph/adb2c-graph-user.gql.schema.ts ***!
  \********************************************************************/
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
exports.schema = [
    `
  type User {
    city:  String 
    country: String 
    displayName: String 
    givenName: String
    postalCode: String
    email: String
    preferredLanguage: String
    state : String
    streetAddress: String

  }

  extend type Query {
    user: User
  }

`
];
exports.typeResolvers = {};
exports.queryResolvers = {
    user: (_, args, { oid, dataSources }) => __awaiter(this, void 0, void 0, function* () {
        const getUserResult = yield dataSources.adB2cGraphAPI.getUser(oid);
        const { city, country, displayName, givenName, postalCode, signInNames, preferredLanguage, state, streetAddress, } = getUserResult;
        const email = signInNames[0];
        return {
            city,
            country,
            displayName,
            givenName,
            email,
            postalCode,
            preferredLanguage,
            state,
            streetAddress,
        };
    })
};


/***/ }),

/***/ "./src/gql/schemas/executable-schema.ts":
/*!**********************************************!*\
  !*** ./src/gql/schemas/executable-schema.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = __webpack_require__(/*! graphql-tools */ "graphql-tools");
const geo_points_gql_schema_1 = __webpack_require__(/*! ./geo-points/geo-points.gql.schema */ "./src/gql/schemas/geo-points/geo-points.gql.schema.ts");
const adb2c_graph_photo_gql_schema_1 = __webpack_require__(/*! ./adb2c-graph/adb2c-graph-photo.gql.schema */ "./src/gql/schemas/adb2c-graph/adb2c-graph-photo.gql.schema.ts");
const adb2c_graph_user_gql_schema_1 = __webpack_require__(/*! ./adb2c-graph/adb2c-graph-user.gql.schema */ "./src/gql/schemas/adb2c-graph/adb2c-graph-user.gql.schema.ts");
const rootSchema = [
    `
    type Query {
        testMessage: String!
    }

    type Mutation {
      testMessage(name: String): String!
    }

    schema {
      query: Query  
      mutation: Mutation
    }
`
];
const schema = [
    ...rootSchema,
    ...geo_points_gql_schema_1.schema,
    ...adb2c_graph_photo_gql_schema_1.schema,
    ...adb2c_graph_user_gql_schema_1.schema
];
const resolvers = Object.assign({}, geo_points_gql_schema_1.typeResolvers, adb2c_graph_photo_gql_schema_1.typeResolvers, adb2c_graph_user_gql_schema_1.typeResolvers, { Query: Object.assign({ testMessage: () => {
            return "Hello World!";
        } }, geo_points_gql_schema_1.queryResolvers, adb2c_graph_photo_gql_schema_1.queryResolvers, adb2c_graph_user_gql_schema_1.queryResolvers), Mutation: Object.assign({}, adb2c_graph_photo_gql_schema_1.mutationResolvers) });
const executableSchema = graphql_tools_1.makeExecutableSchema({
    typeDefs: schema,
    resolvers
});
exports.default = executableSchema;


/***/ })

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvZ3FsL3NjaGVtYXMvYWRiMmMtZ3JhcGgvYWRiMmMtZ3JhcGgtdXNlci5ncWwuc2NoZW1hLnRzIiwid2VicGFjazovLy8uL3NyYy9ncWwvc2NoZW1hcy9leGVjdXRhYmxlLXNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBYSxjQUFNLEdBQUc7SUFDcEI7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQWtCRDtDQUNBLENBQUM7QUFDVyxxQkFBYSxHQUFHLEVBQUUsQ0FBQztBQUNuQixzQkFBYyxHQUFHO0lBQzVCLElBQUksRUFBRSxDQUFPLENBQU0sRUFBRSxJQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFPLEVBQUUsRUFBRTtRQUMzRCxNQUFNLGFBQWEsR0FBRyxNQUFNLFdBQVcsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBR25FLE1BQU0sRUFDSixJQUFJLEVBQ0osT0FBTyxFQUNQLFdBQVcsRUFDWCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFdBQVcsRUFDWCxpQkFBaUIsRUFDakIsS0FBSyxFQUNMLGFBQWEsR0FDZCxHQUFHLGFBQWEsQ0FBQztRQUVsQixNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBRTVCLE9BQU87WUFDTCxJQUFJO1lBQ0osT0FBTztZQUNQLFdBQVc7WUFDWCxTQUFTO1lBQ1QsS0FBSztZQUNMLFVBQVU7WUFDVixpQkFBaUI7WUFDakIsS0FBSztZQUNMLGFBQWE7U0FDZCxDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ3JERixrRkFBcUQ7QUFDckQsdUpBSTRDO0FBQzVDLDhLQUtvRDtBQUVwRCwyS0FJbUQ7QUFFbkQsTUFBTSxVQUFVLEdBQUc7SUFDakI7Ozs7Ozs7Ozs7Ozs7Q0FhRDtDQUNBLENBQUM7QUFDRixNQUFNLE1BQU0sR0FBRztJQUNiLEdBQUcsVUFBVTtJQUNiLEdBQUcsOEJBQWU7SUFDbEIsR0FBRyxxQ0FBcUI7SUFDeEIsR0FBRyxvQ0FBb0I7Q0FDeEIsQ0FBQztBQUVGLE1BQU0sU0FBUyxxQkFDVixxQ0FBc0IsRUFDdEIsNENBQTRCLEVBQzVCLDJDQUEyQixJQUU5QixLQUFLLGtCQUNILFdBQVcsRUFBRSxHQUFXLEVBQUU7WUFDeEIsT0FBTyxjQUFjLENBQUM7UUFDeEIsQ0FBQyxJQUNFLHNDQUF1QixFQUN2Qiw2Q0FBNkIsRUFDN0IsNENBQTRCLEdBR2pDLFFBQVEsb0JBQ0gsZ0RBQWdDLElBRXRDLENBQUM7QUFFRixNQUFNLGdCQUFnQixHQUFHLG9DQUFvQixDQUFDO0lBQzVDLFFBQVEsRUFBRSxNQUFNO0lBQ2hCLFNBQVM7Q0FDVixDQUFDLENBQUM7QUFFSCxrQkFBZSxnQkFBZ0IsQ0FBQyIsImZpbGUiOiJtYWluLmY1MjZiOWE5NzlhZDNmNjViNzRmLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3Qgc2NoZW1hID0gW1xuICBgXG4gIHR5cGUgVXNlciB7XG4gICAgY2l0eTogIFN0cmluZyBcbiAgICBjb3VudHJ5OiBTdHJpbmcgXG4gICAgZGlzcGxheU5hbWU6IFN0cmluZyBcbiAgICBnaXZlbk5hbWU6IFN0cmluZ1xuICAgIHBvc3RhbENvZGU6IFN0cmluZ1xuICAgIGVtYWlsOiBTdHJpbmdcbiAgICBwcmVmZXJyZWRMYW5ndWFnZTogU3RyaW5nXG4gICAgc3RhdGUgOiBTdHJpbmdcbiAgICBzdHJlZXRBZGRyZXNzOiBTdHJpbmdcblxuICB9XG5cbiAgZXh0ZW5kIHR5cGUgUXVlcnkge1xuICAgIHVzZXI6IFVzZXJcbiAgfVxuXG5gXG5dO1xuZXhwb3J0IGNvbnN0IHR5cGVSZXNvbHZlcnMgPSB7fTtcbmV4cG9ydCBjb25zdCBxdWVyeVJlc29sdmVycyA9IHtcbiAgdXNlcjogYXN5bmMgKF86IGFueSwgYXJnczogYW55LCB7IG9pZCwgZGF0YVNvdXJjZXMgfTogYW55KSA9PiB7XG4gICAgY29uc3QgZ2V0VXNlclJlc3VsdCA9IGF3YWl0IGRhdGFTb3VyY2VzLmFkQjJjR3JhcGhBUEkuZ2V0VXNlcihvaWQpO1xuICAgIFxuXG4gICAgY29uc3Qge1xuICAgICAgY2l0eSxcbiAgICAgIGNvdW50cnksXG4gICAgICBkaXNwbGF5TmFtZSxcbiAgICAgIGdpdmVuTmFtZSxcbiAgICAgIHBvc3RhbENvZGUsXG4gICAgICBzaWduSW5OYW1lcyxcbiAgICAgIHByZWZlcnJlZExhbmd1YWdlLFxuICAgICAgc3RhdGUsXG4gICAgICBzdHJlZXRBZGRyZXNzLFxuICAgIH0gPSBnZXRVc2VyUmVzdWx0O1xuXG4gICAgY29uc3QgZW1haWwgPSBzaWduSW5OYW1lc1swXVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNpdHksXG4gICAgICBjb3VudHJ5LFxuICAgICAgZGlzcGxheU5hbWUsXG4gICAgICBnaXZlbk5hbWUsXG4gICAgICBlbWFpbCxcbiAgICAgIHBvc3RhbENvZGUsXG4gICAgICBwcmVmZXJyZWRMYW5ndWFnZSxcbiAgICAgIHN0YXRlLFxuICAgICAgc3RyZWV0QWRkcmVzcyxcbiAgICB9O1xuICB9XG59O1xuIiwiaW1wb3J0IHsgbWFrZUV4ZWN1dGFibGVTY2hlbWEgfSBmcm9tIFwiZ3JhcGhxbC10b29sc1wiO1xuaW1wb3J0IHtcbiAgc2NoZW1hIGFzIEdlb1BvaW50c1NjaGVtYSxcbiAgdHlwZVJlc29sdmVycyBhcyBHZW9Qb2ludHNUeXBlUmVzb2x2ZXJzLFxuICBxdWVyeVJlc29sdmVycyBhcyBHZW9Qb2ludHNRdWVyeVJlc29sdmVyc1xufSBmcm9tIFwiLi9nZW8tcG9pbnRzL2dlby1wb2ludHMuZ3FsLnNjaGVtYVwiO1xuaW1wb3J0IHtcbiAgc2NoZW1hIGFzIEFkYjJjR3JhcGhQaG90b1NjaGVtYSxcbiAgdHlwZVJlc29sdmVycyBhcyBBZGIyY0dyYXBoUGhvdG9UeXBlUmVzb2x2ZXJzLFxuICBxdWVyeVJlc29sdmVycyBhcyBBZGIyY0dyYXBoUGhvdG9RdWVyeVJlc29sdmVycyxcbiAgbXV0YXRpb25SZXNvbHZlcnMgYXMgQWRiMmNHcmFwaFBob3RvTXV0YXRpb25SZXNvbHZlcnNcbn0gZnJvbSBcIi4vYWRiMmMtZ3JhcGgvYWRiMmMtZ3JhcGgtcGhvdG8uZ3FsLnNjaGVtYVwiO1xuXG5pbXBvcnQge1xuICBzY2hlbWEgYXMgQWRiMmNHcmFwaFVzZXJTY2hlbWEsXG4gIHR5cGVSZXNvbHZlcnMgYXMgQWRiMmNHcmFwaFVzZXJUeXBlUmVzb2x2ZXJzLFxuICBxdWVyeVJlc29sdmVycyBhcyBBZGIyY0dyYXBoVXNlclF1ZXJ5UmVzb2x2ZXJzXG59IGZyb20gXCIuL2FkYjJjLWdyYXBoL2FkYjJjLWdyYXBoLXVzZXIuZ3FsLnNjaGVtYVwiO1xuXG5jb25zdCByb290U2NoZW1hID0gW1xuICBgXG4gICAgdHlwZSBRdWVyeSB7XG4gICAgICAgIHRlc3RNZXNzYWdlOiBTdHJpbmchXG4gICAgfVxuXG4gICAgdHlwZSBNdXRhdGlvbiB7XG4gICAgICB0ZXN0TWVzc2FnZShuYW1lOiBTdHJpbmcpOiBTdHJpbmchXG4gICAgfVxuXG4gICAgc2NoZW1hIHtcbiAgICAgIHF1ZXJ5OiBRdWVyeSAgXG4gICAgICBtdXRhdGlvbjogTXV0YXRpb25cbiAgICB9XG5gXG5dO1xuY29uc3Qgc2NoZW1hID0gW1xuICAuLi5yb290U2NoZW1hLFxuICAuLi5HZW9Qb2ludHNTY2hlbWEsXG4gIC4uLkFkYjJjR3JhcGhQaG90b1NjaGVtYSxcbiAgLi4uQWRiMmNHcmFwaFVzZXJTY2hlbWFcbl07XG5cbmNvbnN0IHJlc29sdmVycyA9IHtcbiAgLi4uR2VvUG9pbnRzVHlwZVJlc29sdmVycyxcbiAgLi4uQWRiMmNHcmFwaFBob3RvVHlwZVJlc29sdmVycyxcbiAgLi4uQWRiMmNHcmFwaFVzZXJUeXBlUmVzb2x2ZXJzLFxuXG4gIFF1ZXJ5OiB7XG4gICAgdGVzdE1lc3NhZ2U6ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgcmV0dXJuIFwiSGVsbG8gV29ybGQhXCI7XG4gICAgfSxcbiAgICAuLi5HZW9Qb2ludHNRdWVyeVJlc29sdmVycyxcbiAgICAuLi5BZGIyY0dyYXBoUGhvdG9RdWVyeVJlc29sdmVycyxcbiAgICAuLi5BZGIyY0dyYXBoVXNlclF1ZXJ5UmVzb2x2ZXJzXG4gIH0sXG5cbiAgTXV0YXRpb246IHtcbiAgICAuLi5BZGIyY0dyYXBoUGhvdG9NdXRhdGlvblJlc29sdmVyc1xuICB9XG59O1xuXG5jb25zdCBleGVjdXRhYmxlU2NoZW1hID0gbWFrZUV4ZWN1dGFibGVTY2hlbWEoe1xuICB0eXBlRGVmczogc2NoZW1hLFxuICByZXNvbHZlcnNcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBleGVjdXRhYmxlU2NoZW1hO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==