import { v4 } from "uuid";
import { FileInterface } from "../../../types";
import Block from "../blockchain/block.js";
import { findVersion, sha256 } from "../blockchain/utils.js";
import { fileManager, unminedQueue } from "../helpers/constants.js";

export default async function newFileHandler(
    filename: string,
    content: string,
    parentId: string,
) {
    const file: FileInterface = {
        name: filename,
        size: Math.ceil(content.length / 1024), // kilobytes
        hash: sha256(content),
    };  

    const fileBlock = new Block({
        file,
        parentUid: parentId,
        version: !parentId ? "0" : findVersion(parentId),
        prevHash: "",
        nextPk: "",
        pk: "",
    });

    fileBlock.data.autodata = {
        uid: v4(),
        timestamp: Date.now(),
    };
    fileBlock.data.nonce = 0;
    fileBlock.signature = "";
    
    unminedQueue.addToQueue(fileBlock);
    fileManager.saveFileToStorage(filename, content);
}