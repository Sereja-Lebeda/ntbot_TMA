import { useRef, useState } from "react";
import type { TicketFileItem } from "../../../types/ticket.types";
import useMediaQuery from "../../../hooks/useMediaQuery";

import FileCard from "./FileCard";
import ConfirmModal from "../../pages/modalCardWindows/ConfirmModal";

import PlusAttachIcon from "../../../icons/createTicket/PlusAttachIcon";
import MobileFileCard from "./MobileFileCard";

interface EditableAttachmentFieldProps {
  files: TicketFileItem[];
  setFiles: React.Dispatch<React.SetStateAction<TicketFileItem[]>>;
  addFiles: (fileList: FileList) => void;
}

const inputText = "Вы уверены, что хотите удалить прикрепленный файл?";

function EditableAttachmentField({
  files,
  setFiles,
  addFiles,
}: EditableAttachmentFieldProps) {
  const isMobile = useMediaQuery("(max-width: 500px)");

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const refFileAttach = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<TicketFileItem | null>(null);

  function getImageExtension(file: string) {
    const ext = file.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "png":
      case "jpg":
      case "jpeg":
        return true;
      default:
        return false;
    }
  }

  function onConfirm() {
    if (fileToDelete) {
      if (fileToDelete.kind === "new") {
        URL.revokeObjectURL(fileToDelete.url);
      }
      setFiles((prev) => prev.filter((item) => item !== fileToDelete));
    }
    setFileToDelete(null);
    setIsModalOpen(false);
  }

  function onCancel() {
    setFileToDelete(null);
    setIsModalOpen(false);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDragging(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(e.dataTransfer.files);
      }}
      className={`w-full shrink-0  overscroll-x-contain
        ${isMobile ? "flex flex-col justify-start items-center gap-2" : "flex justify-start gap-5 overflow-x-auto"}
        dropdown-scroll `}
    >
      {isModalOpen && (
        <ConfirmModal
          onConfirm={onConfirm}
          onCancel={onCancel}
          inputText={inputText}
        />
      )}

      <input
        type="file"
        multiple
        hidden
        ref={refFileAttach}
        onChange={(e) => {
          if (e.target.files) {
            addFiles(e.target.files);
            e.target.value = "";
          }
        }}
      />

      {files.map((file) => {
        if (file.kind === "existing") {
          return isMobile ? (
            <MobileFileCard
              key={file.url}
              name={file.name}
              dateLabel={file.uploadedAt}
              onDelete={() => {
                setFileToDelete(file);
                setIsModalOpen(true);
              }}
            />
          ) : (
            <FileCard
              key={file.url}
              name={file.name}
              isImage={getImageExtension(file.name)}
              imageUrl={file.url}
              dateLabel={file.uploadedAt}
              onDelete={() => {
                setFileToDelete(file);
                setIsModalOpen(true);
              }}
            />
          );
        }

        // тут file.kind === "new" — TS сам сузит тип благодаря проверке выше
        return isMobile ? (
          <MobileFileCard
            key={file.url}
            name={file.file.name}
            dateLabel={new Date(file.file.lastModified).toLocaleString()}
            onDelete={() => {
              setFileToDelete(file);
              setIsModalOpen(true);
            }}
          />
        ) : (
          <FileCard
            key={file.url}
            name={file.file.name}
            isImage={file.file.type.startsWith("image/")}
            imageUrl={file.url}
            dateLabel={new Date(file.file.lastModified).toLocaleString()}
            onDelete={() => {
              setFileToDelete(file);
              setIsModalOpen(true);
            }}
          />
        );
      })}

      {files.length === 0 ? (
        <button
          onClick={() => refFileAttach.current?.click()}
          className={`w-full h-32.5 px-4 py-2.5
          flex flex-col items-center justify-center gap-2.5
          border border-dashed border-(--bg-border)
          cursor-pointer
          font-consolas font-normal text-sm text-(--text-secondary) leading-5
          group hover:border-(--border-hover-btn)
          ${isDragging ? "border-(--border-hover-btn)" : ""}`}
        >
          <span className="xl:group-hover:text-(--text-primary)">
            {isMobile
              ? `Нажмите для выбора файла`
              : `Перетащите файл сюда или
              нажмите для выбора`}
          </span>
        </button>
      ) : isMobile ? (
        <button
          onClick={() => refFileAttach.current?.click()}
          className={`w-full h-12
        flex items-center justify-center gap-1
        border border-dashed border-(--bg-border) rounded-xs
        cursor-pointer
        font-consolas font-normal text-xs text-(--text-secondary)
        group hover:border-(--border-hover-btn)
        ${isDragging ? "border-(--border-hover-btn)" : ""}`}
        >
          <PlusAttachIcon className="w-2.5 h-2.5 text-(--text-primary)" />
          <span>Загрузить файл</span>
        </button>
      ) : (
        <button
          onClick={() => refFileAttach.current?.click()}
          className={`w-47 h-53
              flex items-center justify-center gap-1
          border border-dashed border-(--bg-border) rounded-xs
          cursor-pointer
          group hover:border-(--border-hover-btn) shrink-0
          ${isDragging ? "border-(--border-hover-btn)" : ""}`}
        >
          <PlusAttachIcon className="w-2.5 h-2.5 text-(--text-primary)" />
          <span className="font-consolas font-normal text-xs text-(--text-secondary) leading-3">
            Загрузить файл
          </span>
        </button>
      )}
    </div>
  );
}

export default EditableAttachmentField;
