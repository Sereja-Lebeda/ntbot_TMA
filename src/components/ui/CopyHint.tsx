import CopyHintVectorIcon from "../../icons/infoblock/CopyHintVectorIcon";

function CopyHint() {
  return (
    <div className="relative w-21.5 h-5 flex items-center select-none">
      <div>
        <CopyHintVectorIcon className="absolute -left-1.5 top-1.5" />
      </div>
      <span className="font-consolas bg-(--bg-border) text-xs text-(--text-primary) font-normal leading-3 flex items-center p-1 rounded-xs">
        Скопировано
      </span>
    </div>
  );
}

export default CopyHint;
