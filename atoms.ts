import { atom } from "jotai";

export const newItemModalOpenAtom = atom<boolean>(true);
export const itemNameAtom = atom<string>("");
export const itemImageAtom = atom<File | null>(null);

export const confirmDeleteModalOpenAtom = atom<boolean>(false);
export const itemToDeleteAtom = atom<{ id: string; name: string } | null>(null);

export const itemsAtom = atom<{ name: string; image: string; id: string }[]>(
  []
);
