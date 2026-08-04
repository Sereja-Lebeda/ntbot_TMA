import CopyHintVectorIcon from "../../icons/infoblock/CopyHintVectorIcon";

function CopyHint() {
  return (
    <div className="xl:relative xl:w-21.5 xl:h-5 xl:flex xl:items-center">
      <div>
        <CopyHintVectorIcon className="xl:absolute xl:-left-1.5 xl:top-1.5" />
      </div>
      <span className="xl:font-consolas xl:bg-(--bg-border) xl:text-xs xl:text-(--text-primary) xl:font-normal xl:leading-3 xl:flex xl:items-center xl:p-1 xl:rounded-xs">
        Скопировано
      </span>
    </div>
  );
}

export default CopyHint;
