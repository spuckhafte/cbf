import { useAtom, useAtomValue } from "jotai"
import Navbar from "./components/Navbar"
import { chainAtom, fileInfoModalAtom, newFileModalAtom, readfileModalAtom } from "./helpers/myatoms"
import NewFileModal from "./components/utils/NewFileModal";
import { useEffect } from "react";
import { BlockInterface } from "src/types";
import FilesView from "./components/FileView";
import FileInfoModal from "./components/utils/FileInfoModal";
import ReadFileModal from "./components/utils/ReadFileModal";

function App() {
    const newFileModal = useAtomValue(newFileModalAtom);
    const fileInfoModal = useAtomValue(fileInfoModalAtom);
    const readFileModal = useAtomValue(readfileModalAtom);

    const [_chain, setChain] = useAtom(chainAtom);

    useEffect(() => {
        window.electron.ipcRenderer.send("get-chain");

        window.electron.ipcRenderer.on("full-chain", (_, data) => {
            const { req_chain } = data as { req_chain: BlockInterface[] };
            setChain(req_chain);
        })
    }, []);

    return <div className="app">
        <Navbar />
        <FilesView />
        {
            newFileModal.show && <NewFileModal />
        }
        {
            fileInfoModal.show && <FileInfoModal />
        }
        {
            readFileModal.show && <ReadFileModal />
        }
    </div>
}

export default App
