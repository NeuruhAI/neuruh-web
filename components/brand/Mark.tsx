// @ts-nocheck
/* recovered from turbopack cache — types erased by transpile */
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";

export function Mark({ className }) {
    return /*#__PURE__*/jsxs("svg", {
        viewBox: "0 0 32 32",
        "aria-hidden": "true",
        className: cn("size-7", className),
        children: [
            /*#__PURE__*/jsx("circle", {
                cx: "16",
                cy: "16",
                r: "14",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1",
                opacity: "0.35"
            }),
            /*#__PURE__*/jsx("circle", {
                cx: "16",
                cy: "16",
                r: "8",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.25"
            }),
            /*#__PURE__*/jsx("path", {
                d: "M16 4v24M4 16h24",
                stroke: "currentColor",
                strokeWidth: "1"
            }),
            /*#__PURE__*/jsx("circle", {
                cx: "16",
                cy: "16",
                r: "2.2",
                fill: "currentColor"
            })
        ]
    });
}
