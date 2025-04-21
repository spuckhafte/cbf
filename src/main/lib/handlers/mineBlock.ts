import { join } from "path";
import { environ, unminedQueue } from "../helpers/constants.js";
import { Worker } from "worker_threads";

export default function mineBlock(event: Electron.IpcMainEvent) {
    const unminedBlock = unminedQueue.getUnmined();
    if (!unminedBlock) {
        event.reply("block_mined");
        return;
    }

    const mine_worker = new Worker(join(__dirname, "./workers/mine.js"));
    mine_worker.postMessage({ 
        blockData: unminedBlock.data,
        pattern: environ.PATTERN,
    });

    mine_worker.on("message", payload => {
        const { nonce } = payload as { nonce: number };
        unminedQueue.consumeBlockToChain(nonce);
        event.reply("block_mined");
        mine_worker.terminate();
    });
}