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
        <div className="w-full">Файлы не прикреплены</div>
      ) : (
        <div className="w-full flex justify-start gap-5 overflow-x-auto overscroll-contain dropdown-scroll">
          {files.map((attached) => (
            <div
              key={`${attached.name}-${attached.url}`}
              className="w-47 h-53
              flex flex-col items-center
              border-[0.8px] border-(--bg-border) rounded-xs
              group shrink-0"
            >
              {/* Image */}
              <div
                className="relative w-full h-37.25 overflow-hidden rounded-xs
                flex justify-center items-center"
              >
                {isImageFile(attached.name) ? (
                  <img
                    src={attached.url}
                    className={`w-full h-full object-cover
                      group-hover:scale-115 ${hoverAnimationStyle} cursor-default!`}
                  />
                ) : (
                  (() => {
                    const Icon = getFileIcon(attached.name);
                    return (
                      <Icon
                        className={`w-1/2 h-1/2
                        group-hover:scale-115 ${hoverAnimationStyle} cursor-default!`}
                      />
                    );
                  })()
                )}
              </div>

              {/* Image info */}
              <div
                className="w-47 h-15.75 p-3 gap-2.5
                flex flex-col justify-center items-start
                font-consolas font-normal"
              >
                <span className="w-full h-full text-xs text-(--text-primary) leading-3 truncate">
                  {attached.name}
                </span>
                <span className="text-[11px] text-(--text-secondary) leading-4">
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
