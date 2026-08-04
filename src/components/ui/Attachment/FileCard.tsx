import CrossIcon from "../../../icons/card/CrossIcon";
import {
  btnPressAnimationStyle,
  hoverAnimationStyle,
} from "../../../styles/pressAnimation";
import { getFileIcon } from "../../../utils/getFileIcon";

interface FileCardProps {
  name: string;
  imageUrl?: string; // если картинка — показать превью
  isImage: boolean;
  dateLabel: string;
  onDelete?: () => void;
}

export default function FileCard({
  name,
  imageUrl,
  isImage,
  dateLabel,
  onDelete,
}: FileCardProps) {
  return (
    <div className="xl:w-47 xl:h-53 xl:flex xl:flex-col xl:items-center xl:border-[0.8px] xl:border-(--bg-border) xl:rounded-xs xl:group xl:shrink-0">
      <div className="xl:relative xl:w-full xl:h-37.25 xl:overflow-hidden xl:rounded-xs xl:flex xl:justify-center xl:items-center">
        {isImage && imageUrl ? (
          <img
            src={imageUrl}
            className={`xl:w-full xl:h-full xl:object-cover xl:group-hover:scale-115 ${hoverAnimationStyle} xl:cursor-default!`}
          />
        ) : (
          (() => {
            const Icon = getFileIcon(name);
            return (
              <Icon
                className={`xl:w-1/2 xl:h-1/2 xl:group-hover:scale-115 ${hoverAnimationStyle} xl:cursor-default!`}
              />
            );
          })()
        )}
        {onDelete && (
          <div
            onClick={onDelete}
            className="xl:absolute xl:top-2 xl:right-2 xl:w-5 xl:h-5 xl:flex xl:justify-center xl:items-center xl:bg-(--bg-secondary) xl:border-[0.8px] xl:border-(--bg-border) xl:rounded-xs xl:group/delete xl:cursor-pointer"
          >
            <CrossIcon
              className={`xl:w-2.5 xl:h-2.5 xl:text-(--text-secondary) xl:group-hover/delete:text-(--text-primary) ${btnPressAnimationStyle}`}
            />
          </div>
        )}
      </div>
      <div className="xl:w-47 xl:h-15.75 xl:p-3 xl:gap-2.5 xl:flex xl:flex-col xl:justify-center xl:items-start xl:font-consolas xl:font-normal">
        <span className="xl:w-full xl:h-full xl:text-xs xl:text-(--text-primary) xl:leading-3 xl:truncate">
          {name}
        </span>
        <span className="xl:text-[11px] xl:text-(--text-secondary) xl:leading-4">
          {dateLabel}
        </span>
      </div>
    </div>
  );
}
