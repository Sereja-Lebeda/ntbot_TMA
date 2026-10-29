function SubcategorySkeleton() {
  return (
    <div
      className={`w-full flex flex-col justify-start bg-(--bg-secondary) px-5 py-4 border border-(--bg-border) animate-pulse`}
    >
      <div className="h-6 flex justify-between items-center">
        <div className="h-4 w-1/2 bg-(--bg-border) rounded-xs"></div>
        <div className="h-5 w-5 bg-(--bg-border) rounded-xs"></div>
      </div>
    </div>
  );
}

export default SubcategorySkeleton;
