"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global Error digest:", error.digest);
        console.error(error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center space-y-4">
                        <AlertTriangle className="h-16 w-16 text-destructive mx-auto" />
                        <h2 className="text-2xl font-bold">Something went wrong</h2>
                        <p className="text-muted-foreground max-w-md">
                            A critical error occurred. Please try again.
                        </p>
                        {error.digest && (
                            <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                                Error Digest: {error.digest}
                            </p>
                        )}
                        <Button onClick={() => reset()}>Try Again</Button>
                    </div>
                </div>
            </body>
        </html>
    );
}
