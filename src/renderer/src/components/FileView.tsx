import { chainAtom, searchBarValueAtom } from "@renderer/helpers/myatoms";
import { useAtom, useAtomValue } from "jotai";
import AFile from "./utils/AFile";
import { useEffect, useState } from "react";
import { BlockInterface } from "src/types";

export default function FilesView() {
    const [chain, _setChain] = useAtom(chainAtom);
    const [chainToShow, setChainToShow] = useState<BlockInterface[]>([]);
    const searchBarValue = useAtomValue(searchBarValueAtom);

    useEffect(() => {
        if (!searchBarValue) {
            setChainToShow(chain);
            return;
        }

        const filteredChain = chain.filter((block) => {
            const fileName = block.data.constructordata.file.name.toLowerCase();
            return fileName.includes(searchBarValue.toLowerCase());
        });

        setChainToShow(filteredChain);
    }, [chain, searchBarValue]);

    return (
        <div className="files-view">
            {chainToShow.reverse().map((block) => (
                <AFile 
                    key={block.data.autodata.uid} 
                    id={block.data.autodata.uid}
                    title={block.data.constructordata.file.name}
                />
            ))}
        </div>
    );
}