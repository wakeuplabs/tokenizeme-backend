import express from "express";
import managementController from "../controllers/management";
import upload from "../controllers/upload";
import JwksRsa from "jwks-rsa";
const { expressjwt: expressJwt } = require('express-jwt');

const router = express.Router();
var jwtCheck = expressJwt({
  secret: JwksRsa.expressJwtSecret({
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWKS_URI!,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"],
});

router.get("/customer", [jwtCheck],  managementController.getCustomer);
router.post("/customer", [jwtCheck],  managementController.createCustomer);
router.post("/uploadProduct", [jwtCheck],  upload.uploadFile);
router.put("/uploadProduct", [jwtCheck],  upload.setStateProduct);
router.get("/listProducts", [jwtCheck],  upload.listUploadedFiles);

export = router;
