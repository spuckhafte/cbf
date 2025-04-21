import { readfileModalAtom, selectedFileAtom } from "@renderer/helpers/myatoms";
import { useAtom } from "jotai";
import { useEffect } from "react";

interface AFileProps {
    id: string
    title: string
}

export default function AFile(props: AFileProps) {
    const [selectedFile, setSelectedFile] = useAtom(selectedFileAtom);
    const [_readFileModalAtom, setReadFileModalAtom] = useAtom(readfileModalAtom);

    function handleFileSelect() {
        if (selectedFile === props.id) {
            setSelectedFile("");
            return;
        }

        setSelectedFile(props.id);
    }

    function handleFileRead() {
        window.electron.ipcRenderer.send("read-file", { uid: props.id });
    }

    useEffect(() => {
        window.electron.ipcRenderer.on("file_read", (_, filedata) => {
            const { data, err } = filedata as { 
                data: {
                    name: string,
                    content: string,
                }, 
                err: string 
            };

            if (err) {
                console.error("Error reading file:", err);
                return;
            }

            setReadFileModalAtom({
                show: true,
                filename: data.name,
                content: data.content,
            });
        });
    }, []);

    return <div 
        className={`file-block ${selectedFile === props.id ? "file-selected" : ""}`} 
        onClick={handleFileSelect}
        onDoubleClick={handleFileRead}
    >
        <img
            src={new URL('../../assets/fileicon.png', import.meta.url).href}
            className="file-icon"
        />
        <div className="file-title">{ props.title }</div>
    </div>
}