export default function getBreadcrumb(crumb: string) {
  return (
    <div
      key={crumb}
      className="xl:flex xl:justify-center xl:items-center xl:px-3 xl:py-1.5
      xl:border-[0.5px] xl:border-(--border-hover-btn) xl:bg-(--bg-secondary) xl:rounded-xs"
    >
      <span className="xl:font-jbmono xl:font-medium xl:text-xs xl:text-(--text-primary) xl:leading-3">
        {crumb}
      </span>
    </div>
  );
}
