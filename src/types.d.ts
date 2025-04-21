export interface Environment {
    ENCDENC_SALT: string
    PATTERN: string
}

export interface EditableBlockInterface {
    data: {
        autodata: {
            uid: string
            timestamp: number
        }
        constructordata: {
            prevHash: string
            parentUid: string
            file: FileInterface
            pk: string
            nextPk: string
            version: string
        }
        nonce: number
    }

    signature: string
}

export interface BlockInterface extends EditableBlockInterface {
    hash: string
    verify(pattern: string): boolean
}

export type SearchableParameters = 
    "uid" | "timestamp" | "prevHash" | "file" | "pk" | "nextPk" | 
    "nonce" | "signature" | "hash" | "parentUid" | "version"

export interface FileInterface {
    name: string
    size: number // kilobytes
    hash: string
}

export interface Keypair {
    publicKey: string
    privateKey: string
}

export type AddToUnmiedQueueError = "parentBlockNotFound" | "unauthorizedParentBlock" | "success"

export interface User {
    uid: string
    username: string
    password: string
    keypair: Keypair
    session: {
        id: string
        expires: number
    }
}