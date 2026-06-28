import React from 'react'

/**
 * Renders stored content — either rich HTML (from TipTap) or legacy plain text.
 * HTML content starts with '<'; plain text is rendered with white-space: pre-line.
 */
export function RichContent({ html, className, style }: { html: string; className?: string; style?: React.CSSProperties }) {
  if (!html) return null

  const isHtml = html.trimStart().startsWith('<')

  if (isHtml) {
    return (
      <div
        className={`rich-content${className ? ' ' + className : ''}`}
        style={style}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  return (
    <div className={className} style={{ whiteSpace: 'pre-line', ...style }}>
      {html}
    </div>
  )
}
