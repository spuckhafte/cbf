import Block from "./block.js";
import { getBlockValueFromParameter } from "./utils.js";
import { BlockInterface, EditableBlockInterface, SearchableParameters } from "../../../types.js"
import { fileManager } from "../helpers/constants.js";
import { ipcMain } from "electron";

export class Chain {
    private blocks: BlockInterface[] = [];
    pattern: string;
    secure = true;

    onBlockAdd?: (block: BlockInterface) => void 

    constructor(pattern: string) {
        this.pattern = pattern;
    }

    addBlock(block: BlockInterface): boolean {
        if (!this.secure)
            return false;

        if (!block.verify(this.pattern))
            return false;

        this.blocks.push(block);

        fileManager.saveChainToFile(this.blocks);
        if (this.onBlockAdd)
            this.onBlockAdd(block);
        return true;
    }

    search(param: SearchableParameters, value: string): BlockInterface[] {
        return this.blocks.filter(block => getBlockValueFromParameter(param, block) === value);
    }

    fillChain(blocks: EditableBlockInterface[]): void {
        blocks.forEach(block => {
            const newBlock = new Block(block.data.constructordata);
            newBlock.data.autodata = block.data.autodata;
            newBlock.data.nonce = block.data.nonce;
            newBlock.signature = block.signature;

            this.blocks.push(newBlock);
        });
    }

    getLastBlock(): BlockInterface | undefined {
        return this.blocks[this.blocks.length - 1];
    }

    getChain() {
        return this.blocks;
    }
}
