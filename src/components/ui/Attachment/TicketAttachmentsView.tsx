import useMediaQuery from "../../../hooks/useMediaQuery";

import type { TicketAttachmentType } from "../../../types/ticket.types";

import FileCard from "./FileCard";
import MobileFileCard from "./MobileFileCard";

interface TicketAttachmentsViewProps {
  files: TicketAttachmentType;
}

function isImageFile(fileName: string): boolean {
  const ext = fileName.split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "webp", "gif"].includes(ext ?? "");
}

function TicketAttachmentsView({ files }: TicketAttachmentsViewProps) {
  const isMobile = useMediaQuery("(max-width: 500px)");

  return (
    <div>
      {/* EMPTY Attachment view for MOBILE & DESKTOP */}
      {files.length === 0 ? (
        <div className="w-full">Файлы не прикреплены</div>
      ) : isMobile ? (
        // NOT empty attachment for MOBILE
        <div className="w-full flex flex-col justify-start gap-2 overflow-x-auto dropdown-scroll overscroll-x-contain">
          {files.map((attached) => (
            <MobileFileCard
              key={`${attached.name}-${attached.url}`}
              name={attached.name}
              dateLabel={new Date(attached.uploadedAt).toLocaleString()}
            />
          ))}
        </div>
      ) : (
        //  NOT empty attachment for DESKTOP
        <div className="w-full flex justify-start gap-5 overflow-x-auto dropdown-scroll overscroll-x-contain">
          {files.map((attached) => (
            <FileCard
              key={`${attached.name}-${attached.url}`}
              name={attached.name}
              imageUrl={attached.url}
              isImage={isImageFile(attached.name)}
              dateLabel={new Date(attached.uploadedAt).toLocaleString()}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketAttachmentsView;
