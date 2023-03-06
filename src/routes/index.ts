import express from "express";
import managementController from "../controllers/management";
const { expressjwt: expressJwt } = require('express-jwt');
var jwks = require('jwks-rsa');

const router = express.Router();
var jwtCheck = expressJwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.JWKS_URI 
    }),
    audience: process.env.AUTH0_AUDIENCE,
    issuer: process.env.AUTH0_ISSUER,
    algorithms: ['RS256']
  });

router.get("/customer", [jwtCheck],  managementController.getCustomer);
router.post("/customer", [jwtCheck],  managementController.createCustomer);

export = router;
