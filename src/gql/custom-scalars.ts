import { GraphQLScalarType, Kind } from 'graphql';

export const coordinatesScalarType = new GraphQLScalarType({
    name: 'Coordinates',
    description: 'A set of coordinates. x, y',
    parseValue(value: any) {
      return value;
    },
    serialize(value : any) {
      return value;
    },
    parseLiteral(ast) {
      if(ast.kind === Kind.FLOAT){
        return ast.value;
      }else {
        return null;
      }

  
    },
  })