type PyramidLoaderProps = {
  size?: "xs" | "sm" | "md" | "lg";
  label?: string;
  className?: string;
};

export function PyramidLoader({
  size = "md",
  label,
  className = "",
}: PyramidLoaderProps) {
  return (
    <div className={`pyramid-loader-root ${className}`.trim()}>
      <div className={`pyramid-loader pyramid-loader--${size}`} aria-hidden="true">
        <div className="pyramid-loader__wrapper">
          <span className="pyramid-loader__side pyramid-loader__side1" />
          <span className="pyramid-loader__side pyramid-loader__side2" />
          <span className="pyramid-loader__side pyramid-loader__side3" />
          <span className="pyramid-loader__side pyramid-loader__side4" />
          <span className="pyramid-loader__shadow" />
        </div>
      </div>
      {label ? (
        <p className="mt-2 text-xs font-medium text-zinc-500" role="status" aria-live="polite">
          {label}
        </p>
      ) : null}
    </div>
  );
}
