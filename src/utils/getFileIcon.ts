import DefaultExtIcon from "../icons/createTicket/fileExtensions/DefaultExtIcon";
import PdfIcon from "../icons/createTicket/fileExtensions/PdfIcon";
import WordIcon from "../icons/createTicket/fileExtensions/WordIcon";
import XlsIcon from "../icons/createTicket/fileExtensions/XlsIcon";

export function getFileIcon(fileName: string) {
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
