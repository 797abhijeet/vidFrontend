interface LoaderProps {
  text: string;
}

export default function Loader({ text }: LoaderProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-4 px-4 mt-3">
      <div className="w-5 h-5 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
      <span className="text-white">{text}</span>
    </div>
  );
}