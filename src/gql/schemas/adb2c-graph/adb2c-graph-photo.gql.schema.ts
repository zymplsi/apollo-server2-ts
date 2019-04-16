import { GraphQLUpload } from "graphql-upload";
import { b2cGraphGetPhoto, b2cGraphUploadPhoto } from "../../api/adb2c-graph-photo.api";


export const schema = [
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

export const typeResolvers = {
  Upload: GraphQLUpload
};
export const queryResolvers = {
  userAvatar: async (_: any, args: any, { oid }: any) => {
    const getPhotoResult = await b2cGraphGetPhoto(oid);
    const imageFile = getPhotoResult.body;
    const contentType = getPhotoResult.headers["content-type"];
    const bufferBase64 = Buffer.from(imageFile).toString("base64");
    return { imageBase64: `data:${contentType};base64, ${bufferBase64}` };
  }
};

const processUpload = async (userId: string, upload: any) => {
  const { createReadStream } = await upload;
  const stream = createReadStream();
  const b2cGraphUploadPhotoResult = await b2cGraphUploadPhoto(userId, stream);
  return { result: b2cGraphUploadPhotoResult };
};

export const mutationResolvers = {
  avatarUpload: (_: any, { file }: any, { oid }: any) => {
    return processUpload(oid, file);
  }
};
