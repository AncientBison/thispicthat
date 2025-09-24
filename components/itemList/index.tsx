import ItemTile from "@/components/itemList/itemTile";

export default function ItemList({
  items,
}: {
  items: { name: string; image: string }[];
}) {
  return (
    <div className="columns-1 md:columns-2 xl:columns-3 gap-4 p-4 max-w-6xl mx-auto">
      {items.map((item) => (
        <ItemTile key={item.name} name={item.name} image={item.image} />
      ))}
    </div>
  );
}
