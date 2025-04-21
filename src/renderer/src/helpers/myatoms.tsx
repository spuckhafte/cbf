import { atom } from "jotai";
import { BlockInterface } from "../../../types"

interface NewFileModalAtom {
    show: boolean;
    onClose: (
        (filename: string, content: string, btnid: string, parentId: string) => void
    ) | null;
}

export const newFileModalAtom = atom<NewFileModalAtom>({
    show: false,
    onClose: null,
});

export const fileInfoModalAtom = atom({ show: false });

export const chainAtom = atom<BlockInterface[]>([]);

export const selectedFileAtom = atom("");

export const searchBarValueAtom = atom("");

interface ReadFileModalAtom {
    show: boolean;
    filename?: string;
    content?: string;
}
export const readfileModalAtom = atom<ReadFileModalAtom>({ show: false });

