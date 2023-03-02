import http from "http";
import express, { Express } from "express";
import morgan from "morgan";
import routes from "./routes";
import middlewares from "./middlewares";
import fileUpload from "express-fileupload";
import mongodbClient from "./lib/db/client";
import { bootstrapDatabase } from "./lib/db/entities";
import cors from "cors";

const router: Express = express();

router.use(cors());

/** Logging */
router.use(morgan("dev"));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());
/** Takes care of file upload */
router.use(fileUpload({ useTempFiles: true }));

/** RULES OF OUR API */
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header("Access-Control-Allow-Credentials", 'true');
  next();
});

/** Routes */
router.use("/", routes);

/** Error handling */
router.use(middlewares.notFound);
router.use(middlewares.errorHandler);

/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 6060;

bootstrapDatabase(mongodbClient).then(() =>
  console.log(`The database is up and running`)
);

httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);
