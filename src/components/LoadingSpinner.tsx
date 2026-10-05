export const LoadingSpinner = ({ fullScreen = false }: { fullScreen?: boolean }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-accent rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 font-medium tracking-wide">Cargando...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="w-full py-12 flex items-center justify-center">
      {spinner}
    </div>
  );
};