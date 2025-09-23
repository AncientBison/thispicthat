import { atom } from "jotai";

export const newItemModalOpenAtom = atom<boolean>(true);
export const itemNameAtom = atom<string>("");
export const itemImageAtom = atom<File | null>(null);
