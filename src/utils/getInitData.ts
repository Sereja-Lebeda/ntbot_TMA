function getInitData(): string {
  const initData = window.Telegram?.WebApp?.initData;
  if (!initData) return "";
  return initData;
}

export default getInitData;
