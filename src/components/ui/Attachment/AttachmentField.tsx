import { useRef, useEffect, useState } from "react";

import type { AttachedFile } from "../../../types/createTicket.type";
import { isSameFile } from "../../../utils/fileDublicateHelper";
import { getFileIcon } from "../../../utils/getFileIcon";
import ConfirmModal from "../../pages/modalCardWindows/ConfirmModal";

import {
  hoverAnimationStyle,
  btnPressAnimationStyle,
} from "../../../styles/pressAnimation";
import CrossIcon from "../../../icons/card/CrossIcon";
import PlusAttachIcon from "../../../icons/createTicket/PlusAttachIcon";

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
    <div className="xl:w-full">
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
        <div className="xl:w-full">
          {/* Drag field */}
          <button
            onClick={() => refFileAttach.current?.click()}
            className={`xl:w-full xl:h-32.5 xl:px-4 xl:py-2.5
          xl:flex xl:flex-col xl:items-center xl:justify-center xl:gap-2.5
          xl:border xl:border-dashed xl:border-(--bg-border)
          xl:cursor-pointer
          xl:font-consolas xl:font-normal xl:text-sm xl:text-(--text-secondary) xl:leading-5
          xl:group xl:hover:border-(--border-hover-btn)
          ${isDragging ? "xl:border-(--border-hover-btn)" : ""}`}
          >
            <span className="xl:group-hover:text-(--text-primary)">
              Перетащите файл сюда или
              <br />
              нажмите для выбора
            </span>
          </button>
        </div>
      ) : (
        // Attachment row / container
        <div className="xl:w-full xl:flex xl:justify-start xl:gap-5 xl:overflow-x-auto xl:overscroll-contain xl:dropdown-scroll">
          {files.length >= 1 &&
            files.map((attached) => (
              // Single attachment
              <div
                key={`${attached.file.name}-${attached.file.size}-${attached.file.lastModified}`}
                className="xl:w-47 xl:h-53 xl:flex xl:flex-col xl:items-center xl:border-[0.8px] xl:border-(--bg-border) xl:rounded-xs xl:group xl:shrink-0"
              >
                {/* Image */}
                <div className="xl:relative xl:w-full xl:h-37.25 xl:overflow-hidden xl:rounded-xs xl:flex xl:justify-center xl:items-center">
                  {attached.file.type.startsWith("image/") ? (
                    <img
                      src={attached.url}
                      className={`xl:w-full xl:h-full xl:object-cover
                          xl:group-hover:scale-115 ${hoverAnimationStyle} xl:cursor-default!`}
                    />
                  ) : (
                    (() => {
                      const Icon = getFileIcon(attached.file.name);
                      return (
                        <Icon
                          className={`
                      xl:w-1/2 xl:h-1/2
                      xl:group-hover:scale-115 ${hoverAnimationStyle} xl:cursor-default!`}
                        />
                      );
                    })()
                  )}

                  <div
                    onClick={() => {
                      setFileToDelete(attached);
                      setIsModalOpen(true);
                    }}
                    className="xl:absolute xl:top-2 xl:right-2 xl:w-5 xl:h-5 xl:flex xl:justify-center xl:items-center xl:bg-(--bg-secondary) xl:border-[0.8px] xl:border-(--bg-border) xl:rounded-xs xl:group/delete xl:cursor-pointer"
                  >
                    <CrossIcon
                      className={`xl:w-2.5 xl:h-2.5 xl:text-(--text-secondary)
                        xl:group-hover/delete:text-(--text-primary)
                        ${btnPressAnimationStyle}`}
                    />
                  </div>
                </div>

                {/* Image info */}
                <div className="xl:w-47 xl:h-15.75 xl:p-3 xl:gap-2.5 xl:flex xl:flex-col xl:justify-center xl:items-start xl:font-consolas xl:font-normal">
                  <span className="xl:w-full xl:h-full xl:text-xs xl:text-(--text-primary) xl:leading-3 xl:truncate">
                    {attached.file.name}
                  </span>
                  <span className="xl:text-[11px] xl:text-(--text-secondary) xl:leading-4">
                    {new Date(attached.file.lastModified).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          {/* Button add another attachment */}

          <button
            onClick={() => refFileAttach.current?.click()}
            className={`xl:w-47 xl:h-53
              xl:flex xl:items-center xl:justify-center xl:gap-1
          xl:border xl:border-dashed xl:border-(--bg-border) xl:rounded-xs
          xl:cursor-pointer
          xl:font-consolas xl:font-normal xl:text-xs xl:text-(--text-secondary) xl:leading-3
          xl:group xl:hover:border-(--border-hover-btn) xl:shrink-0
          ${isDragging ? "xl:border-(--border-hover-btn)" : ""}`}
          >
            <PlusAttachIcon className="xl:w-2.5 xl:h-2.5 xl:text-(--text-primary)" />
            <span>Загрузить файл</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default AttachmentaField;
