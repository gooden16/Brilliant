export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cream"></div>
    </div>
  );
}