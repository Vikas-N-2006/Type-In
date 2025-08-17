import { Loader2 } from "lucide-react";

export const LoadingState = ({ text = "Compiling..." }: { text?: string }) => (
    <div className="flex flex-col items-center justify-center gap-4 text-center text-slate-400 font-mono py-16">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
        <p className="text-lg">{text}</p>
    </div>
);