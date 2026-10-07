interface Inset {
  top: number;
  bottom: number;
  left: number;
  right: number;
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
}

interface Window {
  Telegram: { WebApp: TelegramWebApp };
}
