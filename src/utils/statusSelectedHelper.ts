interface handleStatusSelectProps {
  item: string;
  selectedItems: string[];
  setSelectedItems: (filter: string[]) => void;
}

export default function handleStatusSelect({
  item,
  selectedItems,
  setSelectedItems,
}: handleStatusSelectProps) {
  if (setSelectedItems && selectedItems) {
    if (item === "Все") {
      setSelectedItems(["Все"]);
    } else {
      if (selectedItems.includes(item)) {
        const newSelected = selectedItems.filter(
          (i) => i !== item && i !== "Все",
        );
        if (newSelected.length === 0) {
          setSelectedItems(["Все"]);
        } else {
          setSelectedItems(newSelected);
        }
      } else {
        setSelectedItems([...selectedItems.filter((i) => i !== "Все"), item]);
      }
    }
  }
}
