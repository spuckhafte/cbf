import { createHash } from "crypto";
import { BlockInterface, SearchableParameters } from "../../../types";
import { chain, unminedQueue } from "../helpers/constants.js";

export function getBlockValueFromParameter(parameter: SearchableParameters, block: BlockInterface): string {
    switch (parameter) {
        case "uid":
            return block.data.autodata.uid;
        case "timestamp":
            return block.data.autodata.timestamp.toString();
        case "prevHash":
            return block.data.constructordata.prevHash;
        case "file":
            return block.data.constructordata.file.name;
        case "pk":
            return block.data.constructordata.pk;
        case "nextPk":
            return block.data.constructordata.nextPk;
        case "nonce":
            return block.data.nonce.toString();
        case "signature":
            return block.signature;
        case "hash":
            return block.hash;
        case "parentUid":
            return block.data.constructordata.parentUid;
        case "version":
            return block.data.constructordata.version.toString();
    }
}

export function sha256(data: string): string {
    const hash = createHash("sha256");
    hash.update(data);
    return hash.digest("hex");
}

export function findVersion(parentId: string): string {
    const chainBlocks = chain.search("parentUid", parentId);
    const unminedQueueBlocks = unminedQueue.search("parentUid", parentId);

    const newBlockVersion = chainBlocks.length + unminedQueueBlocks.length + 1;
    return newBlockVersion.toString();
}