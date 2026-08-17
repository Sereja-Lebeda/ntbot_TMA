export default function getBreadcrumb(crumb: string) {
  return (
    <div
      key={crumb}
      className="flex justify-center items-center px-3 py-1.5
      border-[0.5px] border-(--border-hover-btn) bg-(--bg-secondary) rounded-xs"
    >
      <span className="font-jbmono font-medium text-xs text-(--text-primary) leading-3">
        {crumb}
      </span>
    </div>
  );
}
