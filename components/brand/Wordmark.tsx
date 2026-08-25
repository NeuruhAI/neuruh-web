// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { Mark } from "@/components/brand/Mark";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Wordmark({ inverted = false, href = "/" }) {
    return /*#__PURE__*/jsxs(Link, {
        href: href,
        className: cn("flex items-center gap-2 tracking-[0.18em] uppercase", inverted ? "text-ink" : "text-bone"),
        children: [
            /*#__PURE__*/jsx(Mark, {
                className: inverted ? "text-copper-ink" : "text-copper"
            }),
            /*#__PURE__*/jsx("span", {
                className: "text-[13px] font-medium",
                children: "Neuruh"
            })
        ]
    });
}
