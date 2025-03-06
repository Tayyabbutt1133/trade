import { Loader2 } from "lucide-react";


const LoadingSpinner = () => {
  return (
    <div className="w-full h-[60dvh] flex justify-center items-center py-10">
      <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
    </div>
  );
};

export default LoadingSpinner;