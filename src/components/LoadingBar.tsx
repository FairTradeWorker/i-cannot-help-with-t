interface LoadingBarProps {
  className?: string;
}

export function LoadingBar({ className = '' }: LoadingBarProps) {
  return (
    <div className={`loading-bar ${className}`} />
  );
}
