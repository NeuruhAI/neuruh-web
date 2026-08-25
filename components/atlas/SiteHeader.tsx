// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { Wordmark } from "@/components/brand/Wordmark";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV } from "@/lib/content/index";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function SiteHeader() {
    const [open, setOpen] = useState(false);
    return /*#__PURE__*/jsx("header", {
        className: "sticky top-0 z-40 border-b border-bone/10 bg-paper/85 backdrop-blur-md",
        children: /*#__PURE__*/jsxs("div", {
            className: "measure flex h-14 items-center justify-between",
            children: [
                /*#__PURE__*/jsx(Wordmark, {}),
                /*#__PURE__*/jsxs("nav", {
                    className: "hidden items-center gap-6 md:flex",
                    "aria-label": "Primary",
                    children: [
                        NAV.map((item)=>/*#__PURE__*/jsx(Link, {
                                href: item.href,
                                className: "text-[13px] text-bone/70 transition-colors hover:text-bone",
                                children: item.label
                            }, item.href)),
                        /*#__PURE__*/jsx(Button, {
                            asChild: true,
                            size: "sm",
                            className: "rounded-sm bg-copper text-white hover:bg-copper/90",
                            children: /*#__PURE__*/jsx(Link, {
                                href: "/build",
                                children: "Build with us"
                            })
                        })
                    ]
                }),
                /*#__PURE__*/jsxs(Sheet, {
                    open: open,
                    onOpenChange: setOpen,
                    children: [
                        /*#__PURE__*/jsx(SheetTrigger, {
                            asChild: true,
                            children: /*#__PURE__*/jsx(Button, {
                                variant: "ghost",
                                size: "icon",
                                className: "min-h-11 min-w-11 md:hidden",
                                "aria-label": "Open menu",
                                children: /*#__PURE__*/jsx(Menu, {})
                            })
                        }),
                        /*#__PURE__*/jsxs(SheetContent, {
                            side: "right",
                            className: "bg-paper text-bone",
                            children: [
                                /*#__PURE__*/jsx(SheetHeader, {
                                    children: /*#__PURE__*/jsx(SheetTitle, {
                                        className: "text-bone",
                                        children: "Atlas"
                                    })
                                }),
                                /*#__PURE__*/jsxs("nav", {
                                    className: "flex flex-col gap-1 px-4",
                                    "aria-label": "Mobile",
                                    children: [
                                        NAV.map((item)=>/*#__PURE__*/jsx(Link, {
                                                href: item.href,
                                                onClick: ()=>setOpen(false),
                                                className: "min-h-11 py-3 text-lg text-bone",
                                                children: item.label
                                            }, item.href)),
                                        /*#__PURE__*/jsx(Link, {
                                            href: "/build",
                                            onClick: ()=>setOpen(false),
                                            className: "min-h-11 py-3 text-copper",
                                            children: "Build with us"
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    });
}
