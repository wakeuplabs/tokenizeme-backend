import { Request, NextFunction } from "express";
import mongodbClient from "../lib/db/client";
import { FileEntity, getFileEntitiesRepository } from "../lib/db/entities";
import { Request as JWTRequest } from "express-jwt";
import { ResponseWithLocals } from "../../modules";
import { PinataHelper } from "../lib/pinataHelper";
import { boolean, number, object, string } from "yup";
import { Readable } from "stream";

const pinata = new PinataHelper();

const productSchema = object().shape({
  productName: string().required(),
  productPrice: number().required(),
  mintNft: boolean().required(),
});

const uploadFile = async (
  req: JWTRequest,
  res: ResponseWithLocals,
  next: NextFunction
) => {
  try {
    const email = req.auth?.['https://email'];

    if(!email){
      throw new Error("Missing email in jwt.");
    }
    
    const { productName, productPrice,mintNft } = await productSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (!req.body.file) {
      throw new Error("Missing file to upload.");
    }

    const file = req.body.file;
    const type = file.charAt(0);
    if (!(type === '/' || type === 'i' || type === 'R')) { //Checks if its an image
      throw new Error("Wrong file type, only images are allowed");
    }

    const stream = new Readable();
    stream.push(Buffer.from(file, 'base64'));
    stream.push(null);
    const uploadResult = await pinata.pinFileToIPFS(stream, {
      pinataMetadata: {
        name: `WakeUp (Image)`,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    });

    const uploadedImageUrl = `${process.env.PINATA_BASE_URL}/${uploadResult.IpfsHash}`;

    const repository = await getFileEntitiesRepository(mongodbClient);

    const fileEntity = new FileEntity(email, productName, productPrice, mintNft);

    fileEntity.uploadedFileUrl = uploadedImageUrl;

    await repository.insert(fileEntity);

    return res.status(200).json({
      id: fileEntity.id.toString(),
      url: uploadedImageUrl,
    });
  } catch (error) {
    return next(error);
  }
};

const listUploadedFiles = async (
  req: Request,
  res: ResponseWithLocals,
  next: NextFunction
) => {
  try {
    const email = res.locals.customer!.id.toString();

    const repository = await getFileEntitiesRepository(mongodbClient);

    const result = await repository.find({ email }).toArray();

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export default {
  uploadFile,
  listUploadedFiles,
};
