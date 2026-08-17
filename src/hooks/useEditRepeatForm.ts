import { useEffect, useRef, useState } from "react";

import type {
  Action,
  AttachedFile,
  CategoryName,
  CategoryNode,
  PriorityLevel,
} from "../types/createTicket.type";
import type {
  StatusType,
  Ticket,
  TicketAttachmentType,
  TicketFileItem,
} from "../types/ticket.types";

import transferFieldValues from "../utils/transferFieldValues";
import { isSameFile } from "../utils/fileDublicateHelper";
import validateForm from "../utils/validateForm";

import mockActionsNested from "../../mockActionsNested.json";

interface useEditRepeatFormProps {
  ticket: Ticket | undefined;
  action: Action | undefined;
  mode: string;
  onClose: () => void;
  onSubmit: (data: {
    formData: Record<string, string>;
    multiData: Record<string, string[]>;
    priority: PriorityLevel;
    action: Action;
    attachedFiles: TicketAttachmentType;
    status: StatusType;
  }) => void;
}

function useEditRepeatForm({
  ticket,
  action,
  mode,
  onClose,
  onSubmit,
}: useEditRepeatFormProps) {
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
  const [newStatus, setNewStatus] = useState<StatusType>(
    ticket?.status ?? "New",
  );

  const lastActionRef = useRef<Action | null>(action ?? null);
  useEffect(() => {
    if (selectedActionState) {
      lastActionRef.current = selectedActionState;
    }
  }, [selectedActionState]);

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
      status: newStatus,
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

  return {
    formData,
    setFormData,
    multiData,
    setMultiData,
    priority,
    setPriority,
    errors,
    setErrors,
    files,
    setFiles,
    editFiles,
    setEditFiles,
    isDragging,
    setIsDragging,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    selectedActionState,
    setSelectedActionState,
    newStatus,
    setNewStatus,
    isConfirmCloseOpen,
    setIsConfirmCloseOpen,
    inputText,
    handleCloseAttempt,
    handleCategoryChange,
    handleSubcategoryChange,
    handleActionChange,
    resetFormState,
    resetCategorySelectionState,
    handleSubmit,
    addFiles,
    addEditFiles,
    attachedFilesFromNew,
    attachedFilesFromMixed,
    clearError,
    setFieldError,
    categoryOptions,
    subcategoryOptions,
    actionOptions,
    currentAction,
    currentErrors,
    isFormInvalid,
  };
}

export default useEditRepeatForm;
