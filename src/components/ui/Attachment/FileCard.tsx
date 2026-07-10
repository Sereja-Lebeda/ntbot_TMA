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
    <div className="w-47 h-53 flex flex-col items-center border-[0.8px] border-(--bg-border) rounded-xs group shrink-0">
      <div className="relative w-full h-37.25 overflow-hidden rounded-xs flex justify-center items-center">
        {isImage && imageUrl ? (
          <img
            src={imageUrl}
            className={`w-full h-full object-cover group-hover:scale-115 ${hoverAnimationStyle} cursor-default!`}
          />
        ) : (
          (() => {
            const Icon = getFileIcon(name);
            return (
              <Icon
                className={`w-1/2 h-1/2 group-hover:scale-115 ${hoverAnimationStyle} cursor-default!`}
              />
            );
          })()
        )}
        {onDelete && (
          <div
            onClick={onDelete}
            className="absolute top-2 right-2 w-5 h-5 flex justify-center items-center bg-(--bg-secondary) border-[0.8px] border-(--bg-border) rounded-xs group/delete cursor-pointer"
          >
            <CrossIcon
              className={`w-2.5 h-2.5 text-(--text-secondary) group-hover/delete:text-(--text-primary) ${btnPressAnimationStyle}`}
            />
          </div>
        )}
      </div>
      <div className="w-47 h-15.75 p-3 gap-2.5 flex flex-col justify-center items-start font-consolas font-normal">
        <span className="w-full h-full text-xs text-(--text-primary) leading-3 truncate">
          {name}
        </span>
        <span className="text-[11px] text-(--text-secondary) leading-4">
          {dateLabel}
        </span>
      </div>
    </div>
  );
}
