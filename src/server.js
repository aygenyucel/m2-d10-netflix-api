import express from "express";
import listEndpoints from "express-list-endpoints";
import mediasRouter from "./api/medias/index.js";
import { join } from "path";
import cors from "cors";
import filesRouter from "./api/files/index.js";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
} from "./errorHandlers.js";

const server = express();
const port = process.env.PORT;

const publicFolderPath = join(process.cwd(), "./public");

//*******MIDDLEWARES***********/

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOpts = {
  origin: (origin, corsNext) => {
    console.log("CURRENT ORIGIN: ", origin);
    if (!origin || whitelist.indexOf(origin !== -1)) {
      //if current origin is in the whitelist you can move on
      corsNext(null, true);
    } else {
      corsNext(
        createHttpError(400, `Origin ${origin} is not in the whitelist!`)
      );
    }
  },
};

server.use(cors(corsOpts));
server.use(express.json());
server.use(express.static(publicFolderPath));

//*******ENDPOINTS*************/

server.use("/medias", mediasRouter);
server.use("/medias", filesRouter);

//*******ERROR HANDLERS********/
server.use(badRequestHandler); //400
server.use(notFoundHandler); //401
server.use(notFoundHandler); //404
server.use(genericErrorHandler); //500

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server is running on port:", port);
});
