import { newFileModalAtom } from "@renderer/helpers/myatoms";
import { useAtom } from "jotai"
import { useRef, useState } from "react";

export default function NewFileModal() {
    const [newFileModal, setNewFileModal] = useAtom(newFileModalAtom);
    const [filename, setFilename] = useState("");
    const [parentId, setParentId] = useState("");
    const [content, setContent] = useState("");

    const mainModal = useRef<HTMLDivElement>(null);
    const fileInputElement = useRef<HTMLInputElement>(null);

    function handleClose(btnid: string) {
        if (!filename.trim() && btnid === "ok") {
            mainModal.current?.classList.add("modal-shake");
            fileInputElement.current?.classList.add("modal-wrong-input");
            fileInputElement.current?.focus();

            setTimeout(() => {
                mainModal.current?.classList.remove("modal-shake");
                fileInputElement.current?.classList.remove("modal-wrong-input");
            }, 500);

            return;
        }

        if (newFileModal.onClose) {
            newFileModal.onClose(filename.trim(), content.trim(), btnid, parentId.trim());
        }

        setNewFileModal({
            show: false,
            onClose: null,
        });
    }

    return <div className="fileModal modal-backdrop">
        <div className="modal" ref={mainModal}>
            <div className="modal-header">
                <div>Create New File</div>
            </div>
            <div className="modal-body">
                <div className="modal-input-group">
                    <input
                        type="text"
                        placeholder="File Name"
                        value={filename}
                        onChange={e => setFilename(e.target.value)}
                        autoFocus
                        ref={fileInputElement}
                    />
                    <input
                        type="text"
                        placeholder="Parent Id"
                        value={parentId}
                        onChange={e => setParentId(e.target.value)}
                    />
                    <textarea
                        placeholder="Content"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={15}
                        className="modal-textarea"
                    />
                </div>
                <div className="modal-buttons">
                    <button
                        className="modal-btn modal-btn-primary"
                        onClick={() => handleClose("ok")}
                    >OK</button>
                    <button
                        className="modal-btn modal-btn-secondary"
                        onClick={() => handleClose("cancel")}
                    >Cancel</button>
                </div>
            </div>
        </div>
    </div>
}