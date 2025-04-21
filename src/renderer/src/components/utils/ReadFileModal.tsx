import { readfileModalAtom } from "@renderer/helpers/myatoms";
import { useAtom } from "jotai";

export default function ReadFileModal() {
    const [readFileModalAtom, setReadFileModalAtom] = useAtom(readfileModalAtom);

    function handleClose() {
        setReadFileModalAtom({
            show: false,
            filename: "",
            content: "",
        });
    }
    
    return <div className="modal-backdrop">
        <div className="modal">
            <div className="modal-header">
                {readFileModalAtom.filename}
            </div>
            <div className="read-modal-content">
                {readFileModalAtom.content}
            </div>
            <div className="modal-buttons">
                <button className="modal-btn modal-btn-secondary" onClick={handleClose}>Close</button>
            </div>
        </div>
    </div>
}