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

interface TelegramWebApp {
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
}

interface Window {
  Telegram: { WebApp: TelegramWebApp };
}
