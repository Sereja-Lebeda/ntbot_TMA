interface Inset {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface BackButton {
  isVisible: boolean;
  show(): void;
  hide(): void;
  onClick(cb: () => void): void;
  offClick(cb: () => void): void;
}

interface HapticFeedback {
  selectionChanged(): void;
  impactOccurred(style: "light" | "medium" | "heavy" | "rigid" | "soft"): void;
  notificationOccurred(type: "success" | "warning" | "error"): void;
}

interface TelegramWebApp {
  initData: string;
  colorScheme: "light" | "dark";
  version: string;
  platform: string;
  isFullscreen: boolean;
  safeAreaInset: Inset;
  contentSafeAreaInset: Inset;
  ready(): void;
  expand(): void;
  disableVerticalSwipes(): void;
  BackButton: BackButton;
  HapticFeedback: HapticFeedback;
}

interface Window {
  Telegram: { WebApp: TelegramWebApp };
}
