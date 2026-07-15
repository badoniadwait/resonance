import { Headphones, ThumbsUp } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderActionsProps {
    email: string;
    className?: string;
}

export function HeaderActions({ email, className }: HeaderActionsProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <Button variant="outline" size="sm" asChild>
                <Link href={`mailto:${email}`}>
                    <ThumbsUp />
                    <span className="hidden lg:block">Feedback</span>
                </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
                <Link href={`mailto:${email}`}>
                    <Headphones />
                    <span className="hidden lg:block">Need help?</span>
                </Link>
            </Button>
        </div>
    );
}
