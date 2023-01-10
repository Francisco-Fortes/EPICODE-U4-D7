import express from "express";

import cors from "cors";

import listEndpoints from "express-list-endpoints";

import authorsRouter from "./authors/index.js";

import blogsRouter from "./blogs/index.js";

import createHttpError from "http-errors";

import { notFound, forbidden, catchAllErrorHandler } from "./errorHandlers.js";

import path, { dirname } from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const publicDirectory = path.join(__dirname, "../public");

const server = express();

//ENV VARIABLES console.log(process.env);
const PORT = process.env.PORT;

//Adding options + whitelist [FEs]
const whitelist = ["http://localhost:3001"];
const corsOptions = {
  origin: (origin, corsNext) => {
    if (whitelist.indexOf(origin) !== -1) {
      //null means no error and true means that is going to be accepted
      corsNext(null, true);
    } else {
      corsNext(createHttpError(400, `${origin} is not in the whitelist`));
      //when origin is undefined means that you are not using a web browser
      //you can pass through if you add Origin(Key) + Value
    }
  },
};

//Global Middleware
server.use(cors(corsOptions));

server.use(express.json());

server.use(express.static(publicDirectory));

server.use("/authors", authorsRouter);

server.use("/blogs", blogsRouter);

server.use(notFound);

server.use(forbidden);

server.use(catchAllErrorHandler);

console.log(listEndpoints(server));

server.listen(PORT, () => console.log("✅ Server is running on port : ", PORT));

server.on("error", (error) =>
  console.log(`❌ Server is not running due to : ${error}`)
);
