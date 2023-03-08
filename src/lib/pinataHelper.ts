import pinataSDK, { PinataPinOptions, PinataPinResponse } from "@pinata/sdk";

const environment = process.env;

export class PinataHelper {
  private pinata;
  private IpfsHash = "testingHash";

  constructor() {
    if (environment.NODE_ENV !== "testing") {
      this.pinata = new pinataSDK(
        process.env.PINATA_API_KEY!,
        process.env.PINATA_SECRET!
      );
    }
  }

  async pinJSONToIPFS(body: Object, options?: PinataPinOptions) {
    if (environment.NODE_ENV === "testing" || !this.pinata) {
      return {
        IpfsHash: this.IpfsHash,
        PinSize: 1024,
        Timestamp: new Date().toISOString(),
      } as PinataPinResponse;
    }

    const uploadResult = await this.pinata.pinJSONToIPFS(body, options);
    return uploadResult;
  }

  async pinFileToIPFS(readableStream: any, options?: PinataPinOptions) {
    if (environment.NODE_ENV === "testing" || !this.pinata) {
      return {
        IpfsHash: this.IpfsHash,
        PinSize: 1024,
        Timestamp: new Date().toISOString(),
      } as PinataPinResponse;
    }

    const uploadResult = await this.pinata.pinFileToIPFS(
      readableStream,
      options
    );
    return uploadResult;
  }
}
