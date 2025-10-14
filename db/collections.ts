import { getItems } from "./items";

export async function getCollectionNames() {
  return ["one", "two", "three"];
}

export async function getCollections() {
  const names = await getCollectionNames();
  return Promise.all(
    names.map(async (name) => ({
      name,
      items: await getCollectionItems(name),
    }))
  );
}

export async function getCollectionItems(name: string) {
  return getItems();
}
