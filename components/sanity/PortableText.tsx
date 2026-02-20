"use client";

import {
  PortableText as PortableTextReact,
  type PortableTextReactComponents,
} from "@portabletext/react";

const components: Partial<PortableTextReactComponents> = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-heading text-2xl font-bold text-white mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-heading text-xl font-bold text-white mt-6 mb-3">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="font-mono text-sm text-white/50 leading-relaxed mb-4">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="space-y-2 mb-4 ml-4">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="space-y-2 mb-4 ml-4 list-decimal">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-3">
        <span className="font-mono text-[10px] text-blue-500 mt-1 flex-shrink-0">
          &#9654;
        </span>
        <span className="font-mono text-sm text-white/50 leading-relaxed">
          {children}
        </span>
      </li>
    ),
    number: ({ children }) => (
      <li className="font-mono text-sm text-white/50 leading-relaxed">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-white font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 transition-colors underline"
      >
        {children}
      </a>
    ),
  },
};

export function PortableText({ value }: { value: unknown[] }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <PortableTextReact value={value as any} components={components} />;
}
