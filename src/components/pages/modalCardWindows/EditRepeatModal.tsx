import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import useEscapeKey from "../../../hooks/useEscapeKey";
import useUser from "../../../hooks/useUser";

import type {
  Action,
  AttachedFile,
  PriorityLevel,
  CategoryNode,
  CategoryName,
} from "../../../types/createTicket.type";
import type {
  Ticket,
  TicketAttachmentType,
  TicketFileItem,
} from "../../../types/ticket.types";
import TicketForm from "../../TicketForm";

import transferFieldValues from "../../../utils/transferFieldValues";
import { getTicketPermissions } from "../../../utils/ticketPermissions";
import getBreadcrumb from "../../../utils/getBreadcrumbs";
import validateForm from "../../../utils/validateForm";
import { isSameFile } from "../../../utils/fileDublicateHelper";

import TicketHeaderInfo from "./TicketHeaderInfo";
import ConfirmModal from "./ConfirmModal";
import FormDropdown from "../../ui/FormDropdown";
import EditableAttachmentField from "../../ui/Attachment/EditableAttachmentField";
import AttachmentaField from "../../ui/Attachment/AttachmentField";
import FunctionBtn from "../../ui/Buttons/FunctionBtn";

import { shadowLiftButtonStyle } from "../../../styles/shadowLift";

import mockActionsNested from "../../../../mockActionsNested.json";

import FloppydiskIcon from "../../../icons/FloppydiskIcon";
import RepeatIcon from "../../../icons/card/RepeatIcon";
import TicketInfoIcon from "../../../icons/card/TicketInfoIcon";
import CrossIcon from "../../../icons/card/CrossIcon";
import SendFormIcon from "../../../icons/createTicket/SendFormIcon";

interface EditRepeatModalProps {
  ticket: Ticket | undefined;
  action: Action | undefined;

  onClose: () => void;
  onSubmit: (data: {
    formData: Record<string, string>;
    multiData: Record<string, string[]>;
    priority: PriorityLevel;
    action: Action;
    attachedFiles: TicketAttachmentType;
  }) => void;
  mode: ModeType;

  favoriteTickets: number[];
  setFavoriteTickets: (id: number[]) => void;
}

type ModeType = "edit" | "repeat";

function EditRepeatModal({
  ticket,
  action,
  onClose,
  onSubmit,
  mode,
  favoriteTickets,
  setFavoriteTickets,
}: EditRepeatModalProps) {
  useLockBodyScroll();
  useEscapeKey(handleCloseAttempt);
  const currentUser = useUser();

  const [formData, setFormData] = useState<Record<string, string>>(
    ticket?.body ?? {},
  );
  const [multiData, setMultiData] = useState<Record<string, string[]>>(
    ticket?.multiBody ?? {},
  );
  const [priority, setPriority] = useState<PriorityLevel>(
    ticket?.priority ?? null,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<AttachedFile[]>([]); // для repeat, работает с AttachmentaField
  const [editFiles, setEditFiles] = useState<TicketFileItem[]>(
    ticket?.attachedFiles.map(
      (f): TicketFileItem => ({ kind: "existing", ...f }),
    ) ?? [],
  ); // для edit, работает с EditableAttachmentField
  const [isDragging, setIsDragging] = useState<boolean>(false);

  //For close modal unsaved changes
  const [isConfirmCloseOpen, setIsConfirmCloseOpen] = useState(false);
  const initialSnapshot = useRef({
    formData: ticket?.body ?? {},
    multiData: ticket?.multiBody ?? {},
    priority: ticket?.priority ?? null,
  });

  const inputText =
    "Вы уверены, что хотите прервать редактирование заявки?\n\nИзмененная информация не сохранится.";

  function hasUnsavedChanges(): boolean {
    return (
      JSON.stringify(formData) !==
        JSON.stringify(initialSnapshot.current.formData) ||
      JSON.stringify(multiData) !==
        JSON.stringify(initialSnapshot.current.multiData) ||
      priority !== initialSnapshot.current.priority
    );
  }
  function handleCloseAttempt() {
    if (hasUnsavedChanges()) {
      setIsConfirmCloseOpen(true);
    } else {
      onClose();
    }
  }

  //edit state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    ticket?.breadcrumbs[0] ?? null,
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    ticket?.breadcrumbs[1] ?? null,
  );
  const [selectedActionState, setSelectedActionState] = useState<Action | null>(
    action ?? null,
  );

  const lastActionRef = useRef<Action | null>(action ?? null);
  useEffect(() => {
    if (selectedActionState) {
      lastActionRef.current = selectedActionState;
    }
  }, [selectedActionState]);

  if (!currentUser || !ticket || !action) return null;
  const permissions = getTicketPermissions(ticket, currentUser);

  //NOTE: comment above to edit modal window with restricted message
  // permissions.canEdit = false;

  if (!permissions.canEdit) {
    return createPortal(
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-(--bg-secondary) border border-(--bg-border) rounded-xs p-8 text-center flex flex-col gap-4 items-center"
        >
          <p className="text-(--text-primary) font-jbmono">
            У вас нет прав на редактирование этой заявки.<br></br>
            Пожалуйста, обратитесь к администратору.
          </p>
          <button
            onClick={onClose}
            className="cursor-pointer text-(--text-secondary) hover:text-(--text-primary)
            font-consolas
            "
          >
            Закрыть
          </button>
        </div>
      </div>,
      document.body,
    );
  }

  const typedActions = mockActionsNested as CategoryNode[];

  const categoryOptions = typedActions.map((c) => c.category);

  const subcategoryOptions = selectedCategory
    ? (typedActions
        .find((c) => c.category === selectedCategory)
        ?.subcategories.map((s) => s.subcategory) ?? [])
    : [];

  const actionOptions =
    selectedSubcategory && selectedCategory
      ? (typedActions
          .find((c) => c.category === selectedCategory)
          ?.subcategories.find((s) => s.subcategory === selectedSubcategory)
          ?.actions.map((a) => a.name) ?? [])
      : [];

  const currentAction = mode === "edit" ? selectedActionState : action;

  //For disable submit button
  // после блока с currentAction
  const currentErrors = currentAction
    ? validateForm(formData, multiData, priority, currentAction)
    : {};
  const isFormInvalid =
    currentAction === null || Object.keys(currentErrors).length > 0;

  function resetFormState() {
    setFormData({});
    setMultiData({});
    setFiles([]);
    setErrors({});
  }

  function resetCategorySelectionState() {
    setFiles([]);
    setErrors({});
  }

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSelectedActionState(null);
    resetCategorySelectionState();
  }

  function handleSubcategoryChange(subcategory: string) {
    setSelectedSubcategory(subcategory);
    setSelectedActionState(null);
    resetCategorySelectionState();
  }

  function handleActionChange(actionName: string) {
    const found = typedActions
      .find((c) => c.category === selectedCategory)
      ?.subcategories.find((s) => s.subcategory === selectedSubcategory)
      ?.actions.find((a) => a.name === actionName);

    if (found) {
      if (selectedCategory && selectedSubcategory) {
        setSelectedActionState({
          ...found,
          category: selectedCategory as CategoryName,
          subcategory: selectedSubcategory,
        });
      } else {
        resetFormState();
      }
    } else {
      setSelectedActionState(null);
    }

    if (!lastActionRef.current || !found) {
      resetFormState();
      return;
    }

    const { formData: newFormData, multiData: newMultiData } =
      transferFieldValues(lastActionRef.current, found, formData, multiData);
    setFormData(newFormData);
    setMultiData(newMultiData);
  }

  function clearError(field: string) {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function setFieldError(field: string, message: string) {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }

  function handleSubmit() {
    if (!currentAction) return;

    const newErrors = validateForm(
      formData,
      multiData,
      priority,
      currentAction,
    );
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const attachedFiles =
      mode === "edit"
        ? attachedFilesFromMixed(editFiles)
        : attachedFilesFromNew(files);

    onSubmit({
      formData,
      multiData,
      priority,
      action: currentAction,
      attachedFiles,
    });
  }

  function addFiles(fileList: FileList) {
    const newFiles = Array.from(fileList);
    setFiles((prev) => {
      const unique = newFiles
        .filter((nf) => !prev.some((item) => isSameFile(item.file, nf)))
        .map((nf) => ({ file: nf, url: URL.createObjectURL(nf) }));
      return [...prev, ...unique];
    });
  }

  function addEditFiles(fileList: FileList) {
    const newFiles = Array.from(fileList);
    setEditFiles((prev) => {
      const unique = newFiles
        .filter(
          (nf) =>
            !prev.some(
              (item) => item.kind === "new" && isSameFile(item.file, nf),
            ),
        )
        .map(
          (nf): TicketFileItem => ({
            kind: "new",
            file: nf,
            url: URL.createObjectURL(nf),
          }),
        );
      return [...prev, ...unique];
    });
  }

  function attachedFilesFromNew(files: AttachedFile[]): TicketAttachmentType {
    return files.map((f) => ({
      name: f.file.name,
      url: f.url,
      uploadedAt: new Date().toISOString(),
    }));
  }

  function attachedFilesFromMixed(
    files: TicketFileItem[],
  ): TicketAttachmentType {
    return files.map((f) =>
      f.kind === "existing"
        ? { name: f.name, url: f.url, uploadedAt: f.uploadedAt }
        : {
            name: f.file.name,
            url: f.url,
            uploadedAt: new Date().toISOString(),
          },
    );
  }

  return createPortal(
    <div
      onClick={handleCloseAttempt}
      className="fixed inset-0
  bg-black/50 z-50
  flex justify-center items-center"
    >
      {isConfirmCloseOpen && (
        <ConfirmModal
          inputText={inputText}
          onConfirm={() => {
            setIsConfirmCloseOpen(false);
            onClose();
          }}
          onCancel={() => setIsConfirmCloseOpen(false)}
        />
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => {
          const target = e.target as HTMLElement;
          const isFormElement = target.closest("input, textarea, select");
          if (!isFormElement) {
            (document.activeElement as HTMLElement)?.blur();
          }
        }}
        className="w-[50vw] max-h-[90vh] flex flex-col items-center gap-4
      bg-(--bg-secondary) border border-(--bg-border) rounded-xs py-10 select-none
      "
      >
        {/* Header */}
        {mode === "edit" ? (
          <div
            className="w-full gap-7
          flex flex-col items-start"
          >
            <TicketHeaderInfo
              favoriteTickets={favoriteTickets}
              setFavoriteTickets={setFavoriteTickets}
              ticket={ticket}
              modalMode="edit"
            />
          </div>
        ) : (
          <div className="w-full flex flex-col justify-center items-start gap-3 px-12.5">
            <div className="w-full flex items-center gap-1">
              <RepeatIcon className="text(--text-secondary) w-4 h-4" />
              <span className="font-consolas font-normal text-xs text-(--text-secondary) leading-4">{`Повтор заявки #${ticket.ticketId}`}</span>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-(--bg-disable-btn)"></div>
          </div>
        )}

        {/* Content */}
        <div
          // className="w-full flex flex-col items-start gap-7 overflow-y-auto dropdown-scroll px-12.5"
          className="w-full flex flex-col items-start gap-7 overflow-y-auto dropdown-scroll px-12.5"
        >
          {/* Ticket information */}
          <div className="w-full flex items-start gap-1">
            <TicketInfoIcon className="text-(--text-primary)" />
            <span className="font-jbmono font-normal text-sm text-(--text-primary) leading-5">
              Информация о заявке
            </span>
          </div>
          <div className="w-full  flex flex-col items-start justify-center gap-8">
            <div className="w-full flex flex-col items-start gap-2">
              <span className="font-consolas font-normal text-xs text-(--text-secondary) leading-3">
                Категории
              </span>

              {mode === "repeat" ? (
                <div className="flex justify-start items-center gap-2">
                  {ticket.breadcrumbs.map(getBreadcrumb)}
                </div>
              ) : (
                <div className="w-full flex flex-col gap-3">
                  <FormDropdown
                    options={categoryOptions}
                    value={selectedCategory ?? ""}
                    onChange={handleCategoryChange}
                    placeholder="Выберите категорию"
                  />
                  <FormDropdown
                    options={subcategoryOptions}
                    value={selectedSubcategory ?? ""}
                    onChange={handleSubcategoryChange}
                    placeholder="Выберите подкатегорию"
                    disabled={!selectedCategory}
                  />
                  <FormDropdown
                    options={actionOptions}
                    value={selectedActionState?.name ?? ""}
                    onChange={handleActionChange}
                    placeholder="Выберите действие"
                    disabled={!selectedSubcategory}
                  />
                </div>
              )}
            </div>
          </div>
          <TicketForm
            selectedAction={currentAction}
            formData={formData}
            setFormData={setFormData}
            multiData={multiData}
            setMultiData={setMultiData}
            priority={priority}
            setPriority={setPriority}
            errors={errors}
            clearError={clearError}
            setFieldError={setFieldError}
          />

          {mode === "edit" ? (
            <EditableAttachmentField
              files={editFiles}
              setFiles={setEditFiles}
              addFiles={addEditFiles}
            />
          ) : (
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
              className="w-full"
            >
              <AttachmentaField
                files={files}
                setFiles={setFiles}
                isDragging={isDragging}
                addFiles={addFiles}
              />
            </div>
          )}

          {/* Divider */}
          <div className="w-full h-px bg-(--bg-disable-btn)"></div>
        </div>

        {/* Buttons */}
        <div className="w-full flex justify-between items-center px-12.5">
          {/* Back btn */}
          <button
            onClick={handleCloseAttempt}
            className="flex justify-center items-center gap-1 py-2.25 cursor-pointer group"
          >
            <CrossIcon className="text-(--text-secondary) group-hover:text-(--text-primary) w-2.25 h-2.25" />
            <span className="font-jbmono font-medium text-(--text-secondary) text-xs leading-normal group-hover:text-(--text-primary)">
              Отмена
            </span>
          </button>

          {/* Send ticket btn */}
          <FunctionBtn
            Icon={mode === "edit" ? FloppydiskIcon : SendFormIcon}
            iconClassName="w-4.5 h-4.5 text-(--text-btn)"
            text={mode === "edit" ? "Сохранить" : "Отправить заявку"}
            textClassName="font-jbmono font-medium text-xs text-(--text-btn) leading-normal"
            innerDivClassName="flex justify-center items-center gap-2"
            btnClassName={`
              h-8.5 px-4 rounded-xs group
              ${shadowLiftButtonStyle}
              enabled:bg-(--bg-btn-primary)
              `}
            onClick={handleSubmit}
            disabled={isFormInvalid}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default EditRepeatModal;
