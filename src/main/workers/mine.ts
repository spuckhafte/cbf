import { parentPort } from "worker_threads";
import { BlockInterface } from "../../types";
import Block from "../lib/blockchain/block.js";

parentPort?.on("message", async (payload) => {
    const { blockData, pattern } = payload as {
        blockData: BlockInterface["data"],
        pattern: string,
    }

    const block = new Block(blockData.constructordata);
    block.data.autodata = blockData.autodata;
    block.data.nonce = blockData.nonce;
    block.signature = "";

    let nonce = 0;
    while (!block.verify(pattern)) {
        block.data.nonce = nonce;
        nonce++;
    }
    
    nonce--;
    parentPort?.postMessage({ nonce });
})