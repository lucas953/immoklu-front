"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function PageHeader({ eyebrow, title, description }) {
    return (_jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-neutral-500", children: eyebrow }), _jsx("h1", { className: "text-4xl font-semibold", children: title }), description ? _jsx("p", { className: "max-w-2xl text-lg text-neutral-700", children: description }) : null] }));
}
