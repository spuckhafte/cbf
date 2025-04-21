import { createSign, createVerify, generateKeyPairSync } from "crypto";
import { assignI, getEl } from "json-db-jdb";
import { BlockInterface, Keypair } from "../../../types";

export default class KeyManager {
    static generatePair(): Keypair {
        const { publicKey, privateKey } = generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: "spki",
                format: "pem",
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem",
            },
        });
        
        return { publicKey, privateKey };
    }

    static newPair(): Keypair {
        const { publicKey, privateKey } = KeyManager.generatePair();
        
        const allPairs = JSON.parse(getEl("keys", "keypairs")?.["pairs"]) as Keypair[];
        allPairs.push({ publicKey, privateKey });
        assignI("keys", "keypairs", {
            pairs: JSON.stringify(allPairs),
        });

        return { publicKey, privateKey };
    }

    static signAndDestroyPair(block: BlockInterface) : boolean {
        const firstKeyPair = (JSON.parse(getEl("keys", "keypairs")?.["pairs"]) as Keypair[])[0];
        if (!firstKeyPair) {
            throw new Error("No key pairs found");
        }

        if (block.data.constructordata.pk !== firstKeyPair.publicKey) {
            return false;
        }

        const signer = createSign("sha256");
        signer.update(block.hash);

        block.signature = signer.sign(firstKeyPair.privateKey, "hex");
        const allPairs = JSON.parse(getEl("keys", "keypairs")?.["pairs"]) as Keypair[];
        allPairs.shift();

        assignI("keys", "keypairs", {
            pairs: JSON.stringify(allPairs),
        });

        return true;
    }

    static useAndCreateNewPair(block: BlockInterface) {
        let lastPair = (JSON.parse(getEl("keys", "keypairs")?.["pairs"]) as Keypair[]).at(-1);
        if (!lastPair)
            lastPair = KeyManager.newPair();

        block.data.constructordata.pk = lastPair.publicKey;
        const newKeyPair = KeyManager.newPair();
        block.data.constructordata.nextPk = newKeyPair.publicKey;
    }

    static verifySignature(signature: string, publicKey: string, hash: string): boolean {
        const verifier = createVerify("rsa-sha256");
        verifier.update(hash);
        return verifier.verify(publicKey, signature, "hex");
    }
}
