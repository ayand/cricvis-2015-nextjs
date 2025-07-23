interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
      <div className={`animate-spin rounded-full border-b-4 border-green-500 ${sizeClasses[size]}`}></div>
      {text && (
        <span className="mt-3 text-md text-gray-600 font-medium">{text}</span>
      )}
    </div>
  );
} 