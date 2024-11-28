import * as uuid from "uuid";

export const LoadingDashboardSkeleton = ({ items = 6, size = "lg" }: { items?: number; size?: "sm" | "lg" }) => {
  const sizes = {
    sm: "h-[4.25rem]",
    lg: "h-[6.25rem]"
  };

  const height = sizes[size];

  return (
    <div role="status" className="animate-pulse w-full">
      {Array.from({ length: items }, (_) => {
        return <div key={uuid.v4()} className={`${height} bg-gray-400 rounded-3xl w-full mb-4`}></div>;
      })}
      <span className="sr-only">Loading...</span>
    </div>
  );
};
