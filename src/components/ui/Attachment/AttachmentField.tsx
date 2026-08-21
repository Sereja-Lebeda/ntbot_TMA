import { useRef, useEffect, useState } from "react";
import useMediaQuery from "../../../hooks/useMediaQuery";

import type { AttachedFile } from "../../../types/createTicket.type";

import { isSameFile } from "../../../utils/fileDublicateHelper";

import ConfirmModal from "../../pages/modalCardWindows/ConfirmModal";
import FileCard from "./FileCard";
import MobileFileCard from "./MobileFileCard";

import PlusAttachIcon from "../../../icons/createTicket/PlusAttachIcon";

interface AttachmentFieldProps {
  files: AttachedFile[];
  setFiles: React.Dispatch<React.SetStateAction<AttachedFile[]>>;
  isDragging: boolean;
  addFiles: (fileList: FileList) => void;
}

function AttachmentField({
  files,
  setFiles,
  isDragging,
  addFiles,
}: AttachmentFieldProps) {
  const isMobile = useMediaQuery("(max-width: 500px)");

  const filesRef = useRef(files);
  filesRef.current = files; // refresh every render

  useEffect(() => {
    return () => {
      filesRef.current.forEach((i) => URL.revokeObjectURL(i.url));
    };
  }, []);

  const refFileAttach = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<AttachedFile | null>(null);

  const inputText = "Вы уверены, что хотите удалить прикрепленный файл?";

  function onConfirm() {
    if (fileToDelete) {
      URL.revokeObjectURL(fileToDelete.url);
      setFiles((prev) =>
        prev.filter((item) => !isSameFile(item.file, fileToDelete.file)),
      );
    }
    setFileToDelete(null);
    setIsModalOpen(false);
  }

  function onCancel() {
    setFileToDelete(null);
    setIsModalOpen(false);
  }

  return (
    <div className="w-full">
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

      {files.length === 0 ? (
        // Empty attachment list for mobile & desktop
        <div className="w-full">
          {/* Drag field */}
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
            <span className="group-hover:text-(--text-primary)">
              {isMobile
                ? `Нажмите для выбора файла`
                : `Перетащите файл сюда или
              нажмите для выбора`}
            </span>
          </button>
        </div>
      ) : isMobile ? (
        // NOT empty MOBILE attachment list
        <div className="flex flex-col justify-center items-center gap-2">
          {files.map((attached) => (
            <MobileFileCard
              key={`${attached.file.name}-${attached.file.size}-${attached.file.lastModified}`}
              name={attached.file.name}
              dateLabel={new Date(attached.file.lastModified).toLocaleString()}
              onDelete={() => {
                setFileToDelete(attached);
                setIsModalOpen(true);
              }}
            />
          ))}

          {/* Button add attachment for MOBILE */}
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
        </div>
      ) : (
        // NOT empty DESKTOP attachment list
        // Attachment row / container
        <div className="w-full flex justify-start gap-5 overflow-x-auto overscroll-x-contain dropdown-scroll">
          {files.length >= 1 &&
            files.map((attached) => (
              // Single attachment
              <FileCard
                key={`${attached.file.name}-${attached.file.size}-${attached.file.lastModified}`}
                name={attached.file.name}
                imageUrl={attached.url}
                isImage={attached.file.type.startsWith("image/")}
                dateLabel={new Date(
                  attached.file.lastModified,
                ).toLocaleString()}
                onDelete={() => {
                  setFileToDelete(attached);
                  setIsModalOpen(true);
                }}
              />
            ))}
          {/* Button add another attachment */}
          <button
            onClick={() => refFileAttach.current?.click()}
            className={`w-47 h-53
              flex items-center justify-center gap-1
          border border-dashed border-(--bg-border) rounded-xs
          cursor-pointer
          font-consolas font-normal text-xs text-(--text-secondary) leading-3
          group hover:border-(--border-hover-btn) shrink-0
          ${isDragging ? "border-(--border-hover-btn)" : ""}`}
          >
            <PlusAttachIcon className="w-2.5 h-2.5 text-(--text-primary)" />
            <span>Загрузить файл</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default AttachmentField;
