import { chain, fileManager } from "../helpers/constants";

export default function readFile(event: Electron.IpcMainEvent, data: { uid: string }) {
    const { uid } = data;
    const block = chain.search("uid", uid)[0];

    if (!block) {
        event.reply("file_read", { error: "File not found" });
        return;
    }

    const fileData = fileManager.readFileFromChain(block.data.constructordata.file.name);
    if (!fileData) {
        event.reply("file_read", { error: "File not found" });
        return;
    }
    
    event.reply("file_read", { 
        data: {
            name: block.data.constructordata.file.name,
            content: fileData.trim(),
        }, 
        error: null 
    });
}