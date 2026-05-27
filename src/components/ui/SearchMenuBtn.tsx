export default function SearchMenuBtn({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="w-10 h-10 flex justify-center items-center rounded-xs dark:bg-(--bg-secondary) border dark:border-(--bg-border)">
      {icon}
    </div>
  );
}
