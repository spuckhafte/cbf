import { BlockInterface } from "../../../types";
import fs from "fs";
import { chain, unminedQueue } from "./constants.js";

export default class FileManager {
    private unminedQueueStoragePath = "./storage/physical/unminedQueue/";
    private chainStoragePath = "./storage/physical/chain/";

    private virtualStoragePath = "./storage/virtual/";
    
    private unminedQueueVirtualFile = "unminedQueue.json";
    private chainVirtualFile = "chain.json";

    
    constructor() {
        this.createStorageDirectories();
    }

    private createStorageDirectories() {
        if (!fs.existsSync(this.unminedQueueStoragePath)) {
            fs.mkdirSync(this.unminedQueueStoragePath, { recursive: true });
        }
        if (!fs.existsSync(this.chainStoragePath)) {
            fs.mkdirSync(this.chainStoragePath, { recursive: true });
        }

        if (!fs.existsSync(this.virtualStoragePath)) {
            fs.mkdirSync(this.virtualStoragePath, { recursive: true });
        }
    }

    public saveUnminedQueueToFile(blocks: BlockInterface[]) {
        const unminedQueueData = blocks;
        fs.writeFileSync(this.unminedQueueVirtualFilePath, JSON.stringify(unminedQueueData));
    }

    public saveChainToFile(blocks: BlockInterface[]) {
        const chainData = blocks;
        fs.writeFileSync(this.chainVirtualFilePath, JSON.stringify(chainData));
    }

    public moveFileToChain(fileName: string) {
        const sourcePath = `${this.unminedQueueStoragePath}${fileName}`;
        const targetPath = `${this.chainStoragePath}${fileName}`;

        if (fs.existsSync(sourcePath)) 
            fs.renameSync(sourcePath, targetPath);
    }

    public loadUnminedQueueFromFile() {
        if (fs.existsSync(this.unminedQueueVirtualFilePath)) {
            const data = fs.readFileSync(this.unminedQueueVirtualFilePath, "utf-8");
            unminedQueue.fillQueue(JSON.parse(data));
        }
    }

    public loadChainFromFile() {
        if (fs.existsSync(this.chainVirtualFilePath)) {
            const data = fs.readFileSync(this.chainVirtualFilePath, "utf-8");
            chain.fillChain(JSON.parse(data));
        }
    }

    public saveFileToStorage(fileName: string, content: string, toChain=false) {
        const targetFolderPath = !toChain ? 
            this.unminedQueueStoragePath : this.chainStoragePath;
            
        const filePath = `${targetFolderPath}${fileName}`;
        fs.writeFileSync(filePath, content);
    }

    public readFileFromChain(fileName: string) {
        const filePath = `${this.chainStoragePath}${fileName}`;
        if (!fs.existsSync(filePath))
            return null;

        return fs.readFileSync(filePath, "utf-8");
}

    get unminedQueueVirtualFilePath() {
        return `${this.virtualStoragePath}${this.unminedQueueVirtualFile}`;
    }

    get chainVirtualFilePath() {
        return `${this.virtualStoragePath}${this.chainVirtualFile}`;
    }
}