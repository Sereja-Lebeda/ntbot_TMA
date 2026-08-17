export type ModalTypes = {
  type: "view" | "edit" | "repeat" | "cancel";
  ticketId: number;
  from?: "view";
} | null;
