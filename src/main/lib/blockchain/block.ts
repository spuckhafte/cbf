import { createHash } from "crypto";
import { v4 } from "uuid";
import { BlockInterface } from "../../../types";

export default class Block implements BlockInterface {
    data: BlockInterface["data"];
    signature = "";

    constructor(data: BlockInterface["data"]["constructordata"]) {
        this.data = {
            autodata: {
                uid: v4(),
                timestamp: Date.now(),
            },
            constructordata: data,
            nonce: 0,
        };
    }

    get hash(): string {
        const blockStr = JSON.stringify(this.data);
        const hash = createHash('SHA256');
        hash.update(blockStr).end();
        return hash.digest('hex');
    }

    verify(pattern: string): boolean {
        return this.hash.startsWith(pattern);
    }
}
