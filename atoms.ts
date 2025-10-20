import { atom } from "jotai";

export const newItemModalOpenAtom = atom<boolean>(false);
export const itemNameAtom = atom<string>("");
export const itemImageAtom = atom<File | null>(null);

export const confirmDeleteModalOpenAtom = atom<boolean>(false);
export const itemToDeleteAtom = atom<{ id: string; name: string } | null>(null);

export const removeItemFromCollectionModalOpenAtom = atom<boolean>(false);
export const itemToRemoveFromCollectionAtom = atom<{
  id: string;
  name: string;
  collectionId: string;
} | null>(null);

export const collectionAddModalOpenAtom = atom<boolean>(false);

export const newCollectionModalOpenAtom = atom<boolean>(false);
export const newCollectionNameAtom = atom<string>("");

export const itemsAtom = atom<{ name: string; image: string; id: string }[]>(
  []
);

export const collectionsAtom = atom<
  {
    id: string;
    name: string;
    items: { id: string; name: string; image: string }[];
  }[]
>([]);
