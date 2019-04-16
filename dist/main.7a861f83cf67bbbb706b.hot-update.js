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
        const email = signInNames[0].value;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvZ3FsL3NjaGVtYXMvYWRiMmMtZ3JhcGgvYWRiMmMtZ3JhcGgtdXNlci5ncWwuc2NoZW1hLnRzIiwid2VicGFjazovLy8uL3NyYy9ncWwvc2NoZW1hcy9leGVjdXRhYmxlLXNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBYSxjQUFNLEdBQUc7SUFDcEI7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQWtCRDtDQUNBLENBQUM7QUFDVyxxQkFBYSxHQUFHLEVBQUUsQ0FBQztBQUNuQixzQkFBYyxHQUFHO0lBQzVCLElBQUksRUFBRSxDQUFPLENBQU0sRUFBRSxJQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFPLEVBQUUsRUFBRTtRQUMzRCxNQUFNLGFBQWEsR0FBRyxNQUFNLFdBQVcsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBR25FLE1BQU0sRUFDSixJQUFJLEVBQ0osT0FBTyxFQUNQLFdBQVcsRUFDWCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFdBQVcsRUFDWCxpQkFBaUIsRUFDakIsS0FBSyxFQUNMLGFBQWEsR0FDZCxHQUFHLGFBQWEsQ0FBQztRQUVsQixNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSztRQUVsQyxPQUFPO1lBQ0wsSUFBSTtZQUNKLE9BQU87WUFDUCxXQUFXO1lBQ1gsU0FBUztZQUNULEtBQUs7WUFDTCxVQUFVO1lBQ1YsaUJBQWlCO1lBQ2pCLEtBQUs7WUFDTCxhQUFhO1NBQ2QsQ0FBQztJQUNKLENBQUM7Q0FDRixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNyREYsa0ZBQXFEO0FBQ3JELHVKQUk0QztBQUM1Qyw4S0FLb0Q7QUFFcEQsMktBSW1EO0FBRW5ELE1BQU0sVUFBVSxHQUFHO0lBQ2pCOzs7Ozs7Ozs7Ozs7O0NBYUQ7Q0FDQSxDQUFDO0FBQ0YsTUFBTSxNQUFNLEdBQUc7SUFDYixHQUFHLFVBQVU7SUFDYixHQUFHLDhCQUFlO0lBQ2xCLEdBQUcscUNBQXFCO0lBQ3hCLEdBQUcsb0NBQW9CO0NBQ3hCLENBQUM7QUFFRixNQUFNLFNBQVMscUJBQ1YscUNBQXNCLEVBQ3RCLDRDQUE0QixFQUM1QiwyQ0FBMkIsSUFFOUIsS0FBSyxrQkFDSCxXQUFXLEVBQUUsR0FBVyxFQUFFO1lBQ3hCLE9BQU8sY0FBYyxDQUFDO1FBQ3hCLENBQUMsSUFDRSxzQ0FBdUIsRUFDdkIsNkNBQTZCLEVBQzdCLDRDQUE0QixHQUdqQyxRQUFRLG9CQUNILGdEQUFnQyxJQUV0QyxDQUFDO0FBRUYsTUFBTSxnQkFBZ0IsR0FBRyxvQ0FBb0IsQ0FBQztJQUM1QyxRQUFRLEVBQUUsTUFBTTtJQUNoQixTQUFTO0NBQ1YsQ0FBQyxDQUFDO0FBRUgsa0JBQWUsZ0JBQWdCLENBQUMiLCJmaWxlIjoibWFpbi43YTg2MWY4M2NmNjdiYmJiNzA2Yi5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IHNjaGVtYSA9IFtcbiAgYFxuICB0eXBlIFVzZXIge1xuICAgIGNpdHk6ICBTdHJpbmcgXG4gICAgY291bnRyeTogU3RyaW5nIFxuICAgIGRpc3BsYXlOYW1lOiBTdHJpbmcgXG4gICAgZ2l2ZW5OYW1lOiBTdHJpbmdcbiAgICBwb3N0YWxDb2RlOiBTdHJpbmdcbiAgICBlbWFpbDogU3RyaW5nXG4gICAgcHJlZmVycmVkTGFuZ3VhZ2U6IFN0cmluZ1xuICAgIHN0YXRlIDogU3RyaW5nXG4gICAgc3RyZWV0QWRkcmVzczogU3RyaW5nXG5cbiAgfVxuXG4gIGV4dGVuZCB0eXBlIFF1ZXJ5IHtcbiAgICB1c2VyOiBVc2VyXG4gIH1cblxuYFxuXTtcbmV4cG9ydCBjb25zdCB0eXBlUmVzb2x2ZXJzID0ge307XG5leHBvcnQgY29uc3QgcXVlcnlSZXNvbHZlcnMgPSB7XG4gIHVzZXI6IGFzeW5jIChfOiBhbnksIGFyZ3M6IGFueSwgeyBvaWQsIGRhdGFTb3VyY2VzIH06IGFueSkgPT4ge1xuICAgIGNvbnN0IGdldFVzZXJSZXN1bHQgPSBhd2FpdCBkYXRhU291cmNlcy5hZEIyY0dyYXBoQVBJLmdldFVzZXIob2lkKTtcbiAgICBcblxuICAgIGNvbnN0IHtcbiAgICAgIGNpdHksXG4gICAgICBjb3VudHJ5LFxuICAgICAgZGlzcGxheU5hbWUsXG4gICAgICBnaXZlbk5hbWUsXG4gICAgICBwb3N0YWxDb2RlLFxuICAgICAgc2lnbkluTmFtZXMsXG4gICAgICBwcmVmZXJyZWRMYW5ndWFnZSxcbiAgICAgIHN0YXRlLFxuICAgICAgc3RyZWV0QWRkcmVzcyxcbiAgICB9ID0gZ2V0VXNlclJlc3VsdDtcblxuICAgIGNvbnN0IGVtYWlsID0gc2lnbkluTmFtZXNbMF0udmFsdWUgXG5cbiAgICByZXR1cm4ge1xuICAgICAgY2l0eSxcbiAgICAgIGNvdW50cnksXG4gICAgICBkaXNwbGF5TmFtZSxcbiAgICAgIGdpdmVuTmFtZSxcbiAgICAgIGVtYWlsLFxuICAgICAgcG9zdGFsQ29kZSxcbiAgICAgIHByZWZlcnJlZExhbmd1YWdlLFxuICAgICAgc3RhdGUsXG4gICAgICBzdHJlZXRBZGRyZXNzLFxuICAgIH07XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBtYWtlRXhlY3V0YWJsZVNjaGVtYSB9IGZyb20gXCJncmFwaHFsLXRvb2xzXCI7XG5pbXBvcnQge1xuICBzY2hlbWEgYXMgR2VvUG9pbnRzU2NoZW1hLFxuICB0eXBlUmVzb2x2ZXJzIGFzIEdlb1BvaW50c1R5cGVSZXNvbHZlcnMsXG4gIHF1ZXJ5UmVzb2x2ZXJzIGFzIEdlb1BvaW50c1F1ZXJ5UmVzb2x2ZXJzXG59IGZyb20gXCIuL2dlby1wb2ludHMvZ2VvLXBvaW50cy5ncWwuc2NoZW1hXCI7XG5pbXBvcnQge1xuICBzY2hlbWEgYXMgQWRiMmNHcmFwaFBob3RvU2NoZW1hLFxuICB0eXBlUmVzb2x2ZXJzIGFzIEFkYjJjR3JhcGhQaG90b1R5cGVSZXNvbHZlcnMsXG4gIHF1ZXJ5UmVzb2x2ZXJzIGFzIEFkYjJjR3JhcGhQaG90b1F1ZXJ5UmVzb2x2ZXJzLFxuICBtdXRhdGlvblJlc29sdmVycyBhcyBBZGIyY0dyYXBoUGhvdG9NdXRhdGlvblJlc29sdmVyc1xufSBmcm9tIFwiLi9hZGIyYy1ncmFwaC9hZGIyYy1ncmFwaC1waG90by5ncWwuc2NoZW1hXCI7XG5cbmltcG9ydCB7XG4gIHNjaGVtYSBhcyBBZGIyY0dyYXBoVXNlclNjaGVtYSxcbiAgdHlwZVJlc29sdmVycyBhcyBBZGIyY0dyYXBoVXNlclR5cGVSZXNvbHZlcnMsXG4gIHF1ZXJ5UmVzb2x2ZXJzIGFzIEFkYjJjR3JhcGhVc2VyUXVlcnlSZXNvbHZlcnNcbn0gZnJvbSBcIi4vYWRiMmMtZ3JhcGgvYWRiMmMtZ3JhcGgtdXNlci5ncWwuc2NoZW1hXCI7XG5cbmNvbnN0IHJvb3RTY2hlbWEgPSBbXG4gIGBcbiAgICB0eXBlIFF1ZXJ5IHtcbiAgICAgICAgdGVzdE1lc3NhZ2U6IFN0cmluZyFcbiAgICB9XG5cbiAgICB0eXBlIE11dGF0aW9uIHtcbiAgICAgIHRlc3RNZXNzYWdlKG5hbWU6IFN0cmluZyk6IFN0cmluZyFcbiAgICB9XG5cbiAgICBzY2hlbWEge1xuICAgICAgcXVlcnk6IFF1ZXJ5ICBcbiAgICAgIG11dGF0aW9uOiBNdXRhdGlvblxuICAgIH1cbmBcbl07XG5jb25zdCBzY2hlbWEgPSBbXG4gIC4uLnJvb3RTY2hlbWEsXG4gIC4uLkdlb1BvaW50c1NjaGVtYSxcbiAgLi4uQWRiMmNHcmFwaFBob3RvU2NoZW1hLFxuICAuLi5BZGIyY0dyYXBoVXNlclNjaGVtYVxuXTtcblxuY29uc3QgcmVzb2x2ZXJzID0ge1xuICAuLi5HZW9Qb2ludHNUeXBlUmVzb2x2ZXJzLFxuICAuLi5BZGIyY0dyYXBoUGhvdG9UeXBlUmVzb2x2ZXJzLFxuICAuLi5BZGIyY0dyYXBoVXNlclR5cGVSZXNvbHZlcnMsXG5cbiAgUXVlcnk6IHtcbiAgICB0ZXN0TWVzc2FnZTogKCk6IHN0cmluZyA9PiB7XG4gICAgICByZXR1cm4gXCJIZWxsbyBXb3JsZCFcIjtcbiAgICB9LFxuICAgIC4uLkdlb1BvaW50c1F1ZXJ5UmVzb2x2ZXJzLFxuICAgIC4uLkFkYjJjR3JhcGhQaG90b1F1ZXJ5UmVzb2x2ZXJzLFxuICAgIC4uLkFkYjJjR3JhcGhVc2VyUXVlcnlSZXNvbHZlcnNcbiAgfSxcblxuICBNdXRhdGlvbjoge1xuICAgIC4uLkFkYjJjR3JhcGhQaG90b011dGF0aW9uUmVzb2x2ZXJzXG4gIH1cbn07XG5cbmNvbnN0IGV4ZWN1dGFibGVTY2hlbWEgPSBtYWtlRXhlY3V0YWJsZVNjaGVtYSh7XG4gIHR5cGVEZWZzOiBzY2hlbWEsXG4gIHJlc29sdmVyc1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGV4ZWN1dGFibGVTY2hlbWE7XG4iXSwic291cmNlUm9vdCI6IiJ9