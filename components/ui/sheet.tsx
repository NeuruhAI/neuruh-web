// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

export function Sheet({ ...props }) {
    return /*#__PURE__*/jsx(DialogPrimitive.Root, {
        "data-slot": "sheet",
        ...props
    });
}
export function SheetTrigger({ ...props }) {
    return /*#__PURE__*/jsx(DialogPrimitive.Trigger, {
        "data-slot": "sheet-trigger",
        ...props
    });
}
export function SheetClose({ ...props }) {
    return /*#__PURE__*/jsx(DialogPrimitive.Close, {
        "data-slot": "sheet-close",
        ...props
    });
}
function SheetPortal({ ...props }) {
    return /*#__PURE__*/jsx(DialogPrimitive.Portal, {
        "data-slot": "sheet-portal",
        ...props
    });
}
function SheetOverlay({ className, ...props }) {
    return /*#__PURE__*/jsx(DialogPrimitive.Overlay, {
        "data-slot": "sheet-overlay",
        className: cn("fixed inset-0 z-50 bg-black/25 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0", className),
        ...props
    });
}
export function SheetContent({ className, children, side = "right", showCloseButton = true, ...props }) {
    return /*#__PURE__*/jsxs(SheetPortal, {
        children: [
            /*#__PURE__*/jsx(SheetOverlay, {}),
            /*#__PURE__*/jsxs(DialogPrimitive.Content, {
                "data-slot": "sheet-content",
                "data-side": side,
                className: cn("fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-[side=bottom]:data-open:slide-in-from-bottom-10 data-[side=left]:data-open:slide-in-from-left-10 data-[side=right]:data-open:slide-in-from-right-10 data-[side=top]:data-open:slide-in-from-top-10 data-closed:animate-out data-closed:fade-out-0 data-[side=bottom]:data-closed:slide-out-to-bottom-10 data-[side=left]:data-closed:slide-out-to-left-10 data-[side=right]:data-closed:slide-out-to-right-10 data-[side=top]:data-closed:slide-out-to-top-10", className),
                ...props,
                children: [
                    children,
                    showCloseButton && /*#__PURE__*/jsx(DialogPrimitive.Close, {
                        "data-slot": "sheet-close",
                        asChild: true,
                        children: /*#__PURE__*/jsxs(Button, {
                            variant: "ghost",
                            className: "absolute top-3 right-3",
                            size: "icon-sm",
                            children: [
                                /*#__PURE__*/jsx(XIcon, {}),
                                /*#__PURE__*/jsx("span", {
                                    className: "sr-only",
                                    children: "Close"
                                })
                            ]
                        })
                    })
                ]
            })
        ]
    });
}
export function SheetHeader({ className, ...props }) {
    return /*#__PURE__*/jsx("div", {
        "data-slot": "sheet-header",
        className: cn("flex flex-col gap-0.5 p-4", className),
        ...props
    });
}
export function SheetFooter({ className, ...props }) {
    return /*#__PURE__*/jsx("div", {
        "data-slot": "sheet-footer",
        className: cn("mt-auto flex flex-col gap-2 p-4", className),
        ...props
    });
}
export function SheetTitle({ className, ...props }) {
    return /*#__PURE__*/jsx(DialogPrimitive.Title, {
        "data-slot": "sheet-title",
        className: cn("font-heading text-base font-medium text-foreground", className),
        ...props
    });
}
export function SheetDescription({ className, ...props }) {
    return /*#__PURE__*/jsx(DialogPrimitive.Description, {
        "data-slot": "sheet-description",
        className: cn("text-sm text-muted-foreground", className),
        ...props
    });
}
