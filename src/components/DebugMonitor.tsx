"use client";

import { useEffect, useState } from "react";

export default function DebugMonitor() {
    const [logs, setLogs] = useState<string[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only run on client
        if (typeof window === "undefined") return;

        // Check URL param ?debug=true
        const params = new URLSearchParams(window.location.search);
        if (params.get("debug") === "true") {
            setIsVisible(true);
        }

        // Override console.log
        const originalLog = console.log;
        console.log = (...args) => {
            originalLog(...args);
            setLogs((prev) => [`🟢 ${args.map(String).join(" ")}`, ...prev].slice(0, 8));
        };

        // Override console.error
        const originalError = console.error;
        console.error = (...args) => {
            originalError(...args);
            setLogs((prev) => [`🔴 ${args.map(String).join(" ")}`, ...prev].slice(0, 8));
            // setIsVisible(true); // Don't auto-show on error, only if debug=true
        };

        // Catch unhandled errors
        const errorHandler = (event: ErrorEvent) => {
            setLogs((prev) => [`💥 ${event.message}`, ...prev].slice(0, 8));
            // setIsVisible(true); // Don't auto-show on error
        };

        window.addEventListener("error", errorHandler);

        return () => {
            console.log = originalLog;
            console.error = originalError;
            window.removeEventListener("error", errorHandler);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 w-full z-[9999] pointer-events-none p-2 font-mono text-[10px] leading-tight text-white bg-black/50">
            <div className="flex flex-col gap-1">
                {logs.map((log, i) => (
                    <div key={i} className="break-words">
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
}
