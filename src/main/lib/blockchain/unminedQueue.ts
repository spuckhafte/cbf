import { getBlockValueFromParameter } from "./utils.js";
import Block from "./block.js";
import KeyManager from "./keyManager.js";
import { BlockInterface, EditableBlockInterface, SearchableParameters } from "../../../types.js";
import { chain, fileManager } from "../helpers/constants.js";

export class UnminedQueue {
    queue: BlockInterface[] = [];
    pattern: string;

    constructor(pattern: string) {
        this.pattern = pattern;
    }
    
    addToQueue(block: BlockInterface) {
        if (block.data.constructordata.parentUid) {
            const parentBlock = 
                chain.search("uid", block.data.constructordata.parentUid)[0] || 
                this.search("uid", block.data.constructordata.parentUid)[0];

            if (!parentBlock) 
                block.data.constructordata.parentUid = "";
        }

        // if the queue is empty, set the previous hash to the last block in the chain
        if (this.queue.length === 0) {
            block.data.constructordata.prevHash = chain.getLastBlock()?.hash || "";
        }

        KeyManager.useAndCreateNewPair(block);
        this.queue.push(block);

        fileManager.saveUnminedQueueToFile(this.queue);
    }

    getUnmined(): BlockInterface | undefined {
        return this.queue[0];
    }

    consumeBlockToChain(newNonce: number): boolean {
        const targetBlock = this.getUnmined();
        if (!targetBlock) {
            return false;
        }

        targetBlock.data.nonce = newNonce;
        
        if (!targetBlock.verify(this.pattern)) {
            return false;
        }
        
        KeyManager.signAndDestroyPair(targetBlock);
        
        this.queue.shift();
        if (this.queue[0])
            this.queue[0].data.constructordata.prevHash = targetBlock.hash;

        fileManager.saveUnminedQueueToFile(this.queue);
        fileManager.moveFileToChain(targetBlock.data.constructordata.file.name);
        
        return chain.addBlock(targetBlock);
    }

    fillQueue(blocks: EditableBlockInterface[]): void {
        blocks.forEach(block => {
            const newBlock = new Block(block.data.constructordata);
            newBlock.data.autodata = block.data.autodata;
            newBlock.data.nonce = block.data.nonce;
            newBlock.signature = block.signature;

            this.queue.push(newBlock);
        });
    }

    search(param: SearchableParameters, value: string): BlockInterface[] {
        return this.queue.filter(block => getBlockValueFromParameter(param, block) === value);
    }
}