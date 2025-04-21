import { fileInfoModalAtom, newFileModalAtom, searchBarValueAtom } from "@renderer/helpers/myatoms";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
    const [searchBarOpen, setSearchBarOpen] = useState(false);
    const searchBar = useRef<HTMLInputElement>(null);
    const [searchBarValue, setSearchBarValue] = useAtom(searchBarValueAtom);
    const [_newFileModal, setNewFileModal] = useAtom(newFileModalAtom);
    const [mining, setMining] = useState(false);
    const [_fileInfoModal, setFileInfoModal] = useAtom(fileInfoModalAtom);

    function toggleSearchBar() {
        setSearchBarOpen(!searchBarOpen);
        if (!searchBarOpen) {
            setTimeout(() => {
                searchBar.current?.focus();
            }, 0);
        }
    }

    function initiateSearch(event: React.FormEvent) {
        event.preventDefault();
    }

    function handleSearchChange(e: React.FormEvent<HTMLInputElement>) {
        setSearchBarValue(e.currentTarget.value);
    }

    function handleNewFileClick() {
        setNewFileModal({
            show: true,
            onClose: (filename: string, content: string, btnid: string, parentId: string) => {
                if (btnid === "cancel") {
                    setNewFileModal({
                        show: false,
                        onClose: null,
                    });
                    return;
                }

                if (btnid !== "ok") {
                    return;
                }

                window.electron.ipcRenderer.send("new-file", {
                    status: "create",
                    filename: filename.trim(),
                    content: content.trim(),
                    parentId: parentId.trim(),
                });
            }
        });
    }

    function handleMine() {
        if (mining) return;

        setMining(true);
        window.electron.ipcRenderer.send("mine");
    }

    function handleInfoClick() {
        setFileInfoModal({ show: true });
    }

    useEffect(() => {
        window.electron.ipcRenderer.on("block_mined", () => {
            setMining(false);
            window.electron.ipcRenderer.send("get-chain");
        });
    }, []);

    useEffect(() => {
        if (searchBarOpen === false)
            setSearchBarValue("");
    }, [searchBarOpen]);

    return (
        <nav className="navbar">
            <div onClick={handleNewFileClick}>New</div>
            <div 
                onClick={handleMine} 
                className={`navbar-mine ${mining ? "navbar-mine-blocked" : ""}`}
            >
                <div>Mine</div>
                {
                    mining &&
                    <img src={new URL('../assets/loading.gif', import.meta.url).href} />
        }
            </div>
            <div onClick={handleInfoClick}>Info</div>
            <div onClick={toggleSearchBar}>Search</div>
            <form onSubmit={initiateSearch} name="search-bar">
                <input 
                    type="text" 
                    className={`bar search-bar${searchBarOpen ? "-open" : "-closed"}`}
                    ref={searchBar}
                    value={searchBarValue} 
                    onInput={handleSearchChange}
                    placeholder="Search for a file"
                />
            </form>
        </nav>
    );
}