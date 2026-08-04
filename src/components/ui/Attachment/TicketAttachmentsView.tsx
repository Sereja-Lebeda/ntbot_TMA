import type { TicketAttachmentType } from "../../../types/ticket.types";
import { getFileIcon } from "../../../utils/getFileIcon";
import { hoverAnimationStyle } from "../../../styles/pressAnimation";

interface TicketAttachmentsViewProps {
  files: TicketAttachmentType;
}

function isImageFile(fileName: string): boolean {
  const ext = fileName.split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "webp", "gif"].includes(ext ?? "");
}

function TicketAttachmentsView({ files }: TicketAttachmentsViewProps) {
  return (
    <div>
      {files.length === 0 ? (
        <div className="xl:w-full">Файлы не прикреплены</div>
      ) : (
        <div className="xl:w-full xl:flex xl:justify-start xl:gap-5 xl:overflow-x-auto xl:overscroll-contain xl:dropdown-scroll">
          {files.map((attached) => (
            <div
              key={`${attached.name}-${attached.url}`}
              className="xl:w-47 xl:h-53 xl:flex xl:flex-col xl:items-center xl:border-[0.8px] xl:border-(--bg-border) xl:rounded-xs xl:group xl:shrink-0"
            >
              {/* Image */}
              <div className="xl:relative xl:w-full xl:h-37.25 xl:overflow-hidden xl:rounded-xs xl:flex xl:justify-center xl:items-center">
                {isImageFile(attached.name) ? (
                  <img
                    src={attached.url}
                    className={`xl:w-full xl:h-full xl:object-cover
                      xl:group-hover:scale-115 ${hoverAnimationStyle} xl:cursor-default!`}
                  />
                ) : (
                  (() => {
                    const Icon = getFileIcon(attached.name);
                    return (
                      <Icon
                        className={`xl:w-1/2 xl:h-1/2
                        xl:group-hover:scale-115 ${hoverAnimationStyle} xl:cursor-default!`}
                      />
                    );
                  })()
                )}
              </div>

              {/* Image info */}
              <div className="xl:w-47 xl:h-15.75 xl:p-3 xl:gap-2.5 xl:flex xl:flex-col xl:justify-center xl:items-start xl:font-consolas xl:font-normal">
                <span className="xl:w-full xl:h-full xl:text-xs xl:text-(--text-primary) xl:leading-3 xl:truncate">
                  {attached.name}
                </span>
                <span className="xl:text-[11px] xl:text-(--text-secondary) xl:leading-4">
                  {new Date(attached.uploadedAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketAttachmentsView;
