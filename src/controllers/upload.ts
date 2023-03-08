import { Request, NextFunction } from "express";

import fs from "fs";
import mongodbClient from "../lib/db/client";
import { FileEntity, getFileEntitiesRepository } from "../lib/db/entities";

import { ResponseWithLocals } from "../../modules";
import { PinataHelper } from "../lib/pinataHelper";

const pinata = new PinataHelper();

const uploadFile = async (
  req: Request,
  res: ResponseWithLocals,
  next: NextFunction
) => {
  try {
    /* const email = req.user && req.user.email;
    console.log({email})
    if (!email) {
      throw new Error("Missing file to upload.");
    } */

    if (!req.files || !req.files.file || Array.isArray(req.files.file)) {
      throw new Error("Missing file to upload.");
    }

    const file = req.files.file;

    const readableStreamForFile = fs.createReadStream(file.tempFilePath);

    const uploadResult = await pinata.pinFileToIPFS(readableStreamForFile, {
      pinataMetadata: {
        name: `WakeUp (Image)`,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    });

    const uploadedImageUrl = `${process.env.PINATA_BASE_URL}/${uploadResult.IpfsHash}`;

    const repository = await getFileEntitiesRepository(mongodbClient);

    const fileEntity = new FileEntity('hola', file.name, file.size);

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
