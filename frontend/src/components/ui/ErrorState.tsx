import { AlertCircle } from "lucide-react";
import { TerminalWindow } from "./TerminalWindow";

export const ErrorState = ({ message }: { message: string }) => (
    <TerminalWindow title="error.log">
        <div className="flex items-center gap-4 text-red-400 font-mono">
            <AlertCircle className="w-8 h-8 flex-shrink-0" />
            <div>
                <p className="font-bold text-lg">Error: Operation Failed</p>
                <p className="text-sm">{message}</p>
            </div>
        </div>
    </TerminalWindow>
);