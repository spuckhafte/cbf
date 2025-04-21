import { Environment } from "../../../types";
import { configDotenv } from "dotenv";
import { Chain } from "../blockchain/chain";
import { UnminedQueue } from "../blockchain/unminedQueue";
import FileManager from "./fileManager.js";

configDotenv();

export const environ = process.env as unknown as Environment;

export const chain = new Chain(environ.PATTERN);
export const unminedQueue = new UnminedQueue(environ.PATTERN);
export const fileManager = new FileManager();