import { chainAtom, fileInfoModalAtom, selectedFileAtom } from "@renderer/helpers/myatoms.js";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { BlockInterface } from "src/types";

export default function FileInfoModal() {
    const [selectedFile, setSelectedFile] = useAtom(selectedFileAtom);
    const [chain, _setChain] = useAtom(chainAtom);
    const [block, setBlock] = useState<BlockInterface | null>(null);
    const [_fileInfoModal, setFileInfoModal] = useAtom(fileInfoModalAtom)

    useEffect(() => {
        const selectedBlock = chain.find((block) => block.data.autodata.uid === selectedFile);
        setBlock(selectedBlock || null);
    }, []);

    function handleClose() {
        setSelectedFile("");
        setFileInfoModal({ show: false });
    }

    function handleParentFocus() {
        const parentUid = block?.data.constructordata.parentUid;
        if (!parentUid) return;

        setSelectedFile(parentUid);
        setFileInfoModal({ show: false });
    }

    return <div className="modal-backdrop">
        <div className="modal">
            <div className="modal-header">
                <div>File Info</div>
            </div>
            <div className="modal-body">
                {block ? ( // display the info of BlockInterface
                    <div className="fileinfo-modal">
                        <div className="fileinfo-header">
                            <img
                                src={new URL('../../assets/fileicon.png', import.meta.url).href}
                                className="fileinfo-icon"
                            />
                            <div className="fileinfo-title">{block.data.constructordata.file.name}</div>
                        </div>
                        <div className="fileinfo-content">
                            <div><b>Created:</b> {new Date(block.data.autodata.timestamp).toDateString()}</div>
                            <div className="fileinfo-uid"><b>UID: </b>{block.data.autodata.uid}</div>
                            <div className="fileinfo-size">
                                <b>Size: </b>{block.data.constructordata.file.size}b
                            </div>
                            <div className="fileinfo-parent">
                                <b>Parent:</b> <span className="fileinfo-parent-uid" onClick={handleParentFocus}>{
                                    block.data.constructordata.parentUid 
                                        ? block.data.constructordata.parentUid
                                        : "None"
                                }</span>
                            </div>
                            <div><i>(v{block.data.constructordata.version})</i></div>
                        </div>  
                        <div className="modal-buttons">
                            <button onClick={handleClose} className="modal-btn modal-btn-secondary">Close</button>
                        </div>
                    </div>
                ) : (
                    <div className="fileinfo-modal-empty">
                        <div>No file selected</div>
                        <div className="modal-buttons">
                            <button onClick={handleClose} className="modal-btn modal-btn-secondary">Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
}