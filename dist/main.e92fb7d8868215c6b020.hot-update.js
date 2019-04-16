exports.id = "main";
exports.modules = {

/***/ "./src/gql/schemas/adb2c-graph/adb2c-graph-user.gql.schema.ts":
/*!********************************************************************!*\
  !*** ./src/gql/schemas/adb2c-graph/adb2c-graph-user.gql.schema.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected token (51:8)\nYou may need an appropriate loader to handle this file type.\n|             state,\n|             streetAddress,\n>         ;\n|     })\n| };");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvZ3FsL3NjaGVtYXMvZXhlY3V0YWJsZS1zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0ZBQXFEO0FBQ3JELHVKQUk0QztBQUM1Qyw4S0FLb0Q7QUFFcEQsMktBSW1EO0FBRW5ELE1BQU0sVUFBVSxHQUFHO0lBQ2pCOzs7Ozs7Ozs7Ozs7O0NBYUQ7Q0FDQSxDQUFDO0FBQ0YsTUFBTSxNQUFNLEdBQUc7SUFDYixHQUFHLFVBQVU7SUFDYixHQUFHLDhCQUFlO0lBQ2xCLEdBQUcscUNBQXFCO0lBQ3hCLEdBQUcsb0NBQW9CO0NBQ3hCLENBQUM7QUFFRixNQUFNLFNBQVMscUJBQ1YscUNBQXNCLEVBQ3RCLDRDQUE0QixFQUM1QiwyQ0FBMkIsSUFFOUIsS0FBSyxrQkFDSCxXQUFXLEVBQUUsR0FBVyxFQUFFO1lBQ3hCLE9BQU8sY0FBYyxDQUFDO1FBQ3hCLENBQUMsSUFDRSxzQ0FBdUIsRUFDdkIsNkNBQTZCLEVBQzdCLDRDQUE0QixHQUdqQyxRQUFRLG9CQUNILGdEQUFnQyxJQUV0QyxDQUFDO0FBRUYsTUFBTSxnQkFBZ0IsR0FBRyxvQ0FBb0IsQ0FBQztJQUM1QyxRQUFRLEVBQUUsTUFBTTtJQUNoQixTQUFTO0NBQ1YsQ0FBQyxDQUFDO0FBRUgsa0JBQWUsZ0JBQWdCLENBQUMiLCJmaWxlIjoibWFpbi5lOTJmYjdkODg2ODIxNWM2YjAyMC5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbWFrZUV4ZWN1dGFibGVTY2hlbWEgfSBmcm9tIFwiZ3JhcGhxbC10b29sc1wiO1xuaW1wb3J0IHtcbiAgc2NoZW1hIGFzIEdlb1BvaW50c1NjaGVtYSxcbiAgdHlwZVJlc29sdmVycyBhcyBHZW9Qb2ludHNUeXBlUmVzb2x2ZXJzLFxuICBxdWVyeVJlc29sdmVycyBhcyBHZW9Qb2ludHNRdWVyeVJlc29sdmVyc1xufSBmcm9tIFwiLi9nZW8tcG9pbnRzL2dlby1wb2ludHMuZ3FsLnNjaGVtYVwiO1xuaW1wb3J0IHtcbiAgc2NoZW1hIGFzIEFkYjJjR3JhcGhQaG90b1NjaGVtYSxcbiAgdHlwZVJlc29sdmVycyBhcyBBZGIyY0dyYXBoUGhvdG9UeXBlUmVzb2x2ZXJzLFxuICBxdWVyeVJlc29sdmVycyBhcyBBZGIyY0dyYXBoUGhvdG9RdWVyeVJlc29sdmVycyxcbiAgbXV0YXRpb25SZXNvbHZlcnMgYXMgQWRiMmNHcmFwaFBob3RvTXV0YXRpb25SZXNvbHZlcnNcbn0gZnJvbSBcIi4vYWRiMmMtZ3JhcGgvYWRiMmMtZ3JhcGgtcGhvdG8uZ3FsLnNjaGVtYVwiO1xuXG5pbXBvcnQge1xuICBzY2hlbWEgYXMgQWRiMmNHcmFwaFVzZXJTY2hlbWEsXG4gIHR5cGVSZXNvbHZlcnMgYXMgQWRiMmNHcmFwaFVzZXJUeXBlUmVzb2x2ZXJzLFxuICBxdWVyeVJlc29sdmVycyBhcyBBZGIyY0dyYXBoVXNlclF1ZXJ5UmVzb2x2ZXJzXG59IGZyb20gXCIuL2FkYjJjLWdyYXBoL2FkYjJjLWdyYXBoLXVzZXIuZ3FsLnNjaGVtYVwiO1xuXG5jb25zdCByb290U2NoZW1hID0gW1xuICBgXG4gICAgdHlwZSBRdWVyeSB7XG4gICAgICAgIHRlc3RNZXNzYWdlOiBTdHJpbmchXG4gICAgfVxuXG4gICAgdHlwZSBNdXRhdGlvbiB7XG4gICAgICB0ZXN0TWVzc2FnZShuYW1lOiBTdHJpbmcpOiBTdHJpbmchXG4gICAgfVxuXG4gICAgc2NoZW1hIHtcbiAgICAgIHF1ZXJ5OiBRdWVyeSAgXG4gICAgICBtdXRhdGlvbjogTXV0YXRpb25cbiAgICB9XG5gXG5dO1xuY29uc3Qgc2NoZW1hID0gW1xuICAuLi5yb290U2NoZW1hLFxuICAuLi5HZW9Qb2ludHNTY2hlbWEsXG4gIC4uLkFkYjJjR3JhcGhQaG90b1NjaGVtYSxcbiAgLi4uQWRiMmNHcmFwaFVzZXJTY2hlbWFcbl07XG5cbmNvbnN0IHJlc29sdmVycyA9IHtcbiAgLi4uR2VvUG9pbnRzVHlwZVJlc29sdmVycyxcbiAgLi4uQWRiMmNHcmFwaFBob3RvVHlwZVJlc29sdmVycyxcbiAgLi4uQWRiMmNHcmFwaFVzZXJUeXBlUmVzb2x2ZXJzLFxuXG4gIFF1ZXJ5OiB7XG4gICAgdGVzdE1lc3NhZ2U6ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgcmV0dXJuIFwiSGVsbG8gV29ybGQhXCI7XG4gICAgfSxcbiAgICAuLi5HZW9Qb2ludHNRdWVyeVJlc29sdmVycyxcbiAgICAuLi5BZGIyY0dyYXBoUGhvdG9RdWVyeVJlc29sdmVycyxcbiAgICAuLi5BZGIyY0dyYXBoVXNlclF1ZXJ5UmVzb2x2ZXJzXG4gIH0sXG5cbiAgTXV0YXRpb246IHtcbiAgICAuLi5BZGIyY0dyYXBoUGhvdG9NdXRhdGlvblJlc29sdmVyc1xuICB9XG59O1xuXG5jb25zdCBleGVjdXRhYmxlU2NoZW1hID0gbWFrZUV4ZWN1dGFibGVTY2hlbWEoe1xuICB0eXBlRGVmczogc2NoZW1hLFxuICByZXNvbHZlcnNcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBleGVjdXRhYmxlU2NoZW1hO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==