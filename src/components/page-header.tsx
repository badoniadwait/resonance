import { SidebarTrigger } from "./ui/sidebar";
import { cn } from "@/lib/utils";
import { HeaderActions } from "./header-actions";

export function PageHeader({title,className}: {title: string; className?: string}) {
    return (
        <div
            className={cn("flex items-center justify-between border-b px-4 py-4", className,)}
        >
            <div className="flex items-center gap-2">
                <SidebarTrigger/>
                <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
            </div>
            <HeaderActions email="badoniadwait@gmail.com" />
        </div>
    )
}