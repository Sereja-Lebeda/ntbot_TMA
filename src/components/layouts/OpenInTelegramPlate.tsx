const BOT_URL = "https://t.me/miniAppNTbot";

export default function OpenInTelegramPlate() {
  return (
    <div className="h-dvh flex flex-col items-center justify-center gap-4 p-5 text-center bg-(--bg-primary)">
      <div className="text-6xl">🚫</div>
      <h1 className="text-2xl font-semibold text-(--text-primary)">
        Откройте в Telegram
      </h1>
      <p className="max-w-sm leading-relaxed text-(--text-secondary)">
        Это приложение работает только внутри Telegram. Откройте его через бота.
      </p>
      <a
        href={BOT_URL}
        className="px-6 py-3 rounded-lg bg-[#0088cc] text-white font-medium transition-colors hover:bg-[#006ba3]"
      >
        Открыть в Telegram
      </a>
    </div>
  );
}
