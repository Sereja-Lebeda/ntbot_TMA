import { useRef, useEffect, useState } from "react";

import type { AttachedFile } from "../../types/createTicket.type";
import { isSameFile } from "../../utils/fileDublicateHelper";
import ModalWindow from "./ModalWindow";

import {
  hoverAnimationStyle,
  btnPressAnimationStyle,
} from "../../styles/pressAnimation";
import CrossIcon from "../../icons/card/CrossIcon";
import PlusAttachIcon from "../../icons/createTicket/PlusAttachIcon";
import PdfIcon from "../../icons/createTicket/fileExtensions/PdfIcon";
import WordIcon from "../../icons/createTicket/fileExtensions/WordIcon";
import XlsIcon from "../../icons/createTicket/fileExtensions/XlsIcon";
import DefaultExtIcon from "../../icons/createTicket/fileExtensions/DefaultExtIcon";

interface AttachmentaFieldProps {
  files: AttachedFile[];
  setFiles: React.Dispatch<React.SetStateAction<AttachedFile[]>>;
  isDragging: boolean;
  addFiles: (fileList: FileList) => void;
}

function AttachmentaField({
  files,
  setFiles,
  isDragging,
  addFiles,
}: AttachmentaFieldProps) {
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

  function getFileIcon(fileName: string) {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return PdfIcon;
      case "doc":
      case "docx":
        return WordIcon;
      case "xls":
      case "xlsx":
        return XlsIcon;
      default:
        return DefaultExtIcon;
    }
  }

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
        <ModalWindow
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
              Перетащите файл сюда или
              <br />
              нажмите для выбора
            </span>
          </button>
        </div>
      ) : (
        // Attachment row / container
        <div className="w-full flex justify-start gap-5 overflow-x-auto overscroll-contain dropdown-scroll">
          {files.length >= 1 &&
            files.map((attached) => (
              // Single attachment
              <div
                key={`${attached.file.name}-${attached.file.size}-${attached.file.lastModified}`}
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
                  {attached.file.type.startsWith("image/") ? (
                    <img
                      src={attached.url}
                      className={`w-full h-full object-cover
                          group-hover:scale-115 ${hoverAnimationStyle} cursor-default!`}
                    />
                  ) : (
                    (() => {
                      const Icon = getFileIcon(attached.file.name);
                      return (
                        <Icon
                          className={`
                      w-1/2 h-1/2
                      group-hover:scale-115 ${hoverAnimationStyle} cursor-default!`}
                        />
                      );
                    })()
                  )}

                  <div
                    onClick={() => {
                      setFileToDelete(attached);
                      setIsModalOpen(true);
                    }}
                    className="absolute top-2 right-2 w-5 h-5
                        flex justify-center items-center
                        bg-(--bg-secondary) border-[0.8px] border-(--bg-border) rounded-xs
                      group/delete cursor-pointer"
                  >
                    <CrossIcon
                      className={`w-2.5 h-2.5 text-(--text-secondary)
                        group-hover/delete:text-(--text-primary)
                        ${btnPressAnimationStyle}`}
                    />
                  </div>
                </div>

                {/* Image info */}
                <div
                  className="w-47 h-15.75 p-3 gap-2.5
                flex flex-col justify-center items-start
                font-consolas font-normal"
                >
                  <span className="w-full h-full text-xs text-(--text-primary) leading-3 truncate">
                    {attached.file.name}
                  </span>
                  <span className="text-[11px] text-(--text-secondary) leading-4">
                    {new Date(attached.file.lastModified).toLocaleString()}
                  </span>
                </div>
              </div>
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
            <PlusAttachIcon className="w-2.5 h-2.5" />
            <span>Загрузить файл</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default AttachmentaField;
