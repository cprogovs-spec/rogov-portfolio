'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import { Node, mergeAttributes } from '@tiptap/core'
import { useRef, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// ─── Custom Video Node ────────────────────────────────────────────────────────
const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  addAttributes() {
    return { src: { default: null } }
  },
  parseHTML() {
    return [{ tag: 'video[src]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes({ controls: true, style: 'max-width:100%;border-radius:4px;' }, HTMLAttributes)]
  },
})

// ─── Upload helper ────────────────────────────────────────────────────────────
async function uploadToStorage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'bin'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('media').upload(path, file, { upsert: false })
  if (error) throw new Error(error.message)
  const { data } = supabase.storage.from('media').getPublicUrl(path)
  return data.publicUrl
}

// ─── Toolbar button ───────────────────────────────────────────────────────────
function Btn({ label, active, onClick, title }: { label: string; active?: boolean; onClick: () => void; title?: string }) {
  return (
    <button
      type="button"
      title={title ?? label}
      onClick={onClick}
      style={{
        padding: '4px 8px',
        minWidth: 28,
        height: 28,
        background: active ? '#2a4a2a' : '#1a1a1a',
        border: `1px solid ${active ? '#6B935C' : '#333'}`,
        borderRadius: 3,
        color: active ? '#8cd66e' : '#888',
        cursor: 'pointer',
        fontFamily: 'monospace',
        fontSize: '12px',
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Введите текст...',
}: {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const uploadingRef = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Image.configure({ inline: false, allowBase64: false }),
      Video,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  // sync external value changes (e.g. when editing form resets)
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (value !== current) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor || uploadingRef.current) return
    uploadingRef.current = true
    try {
      const url = await uploadToStorage(file)
      editor.chain().focus().setImage({ src: url }).run()
    } catch (err) {
      alert('Ошибка загрузки изображения: ' + (err as Error).message)
    } finally {
      uploadingRef.current = false
      e.target.value = ''
    }
  }, [editor])

  const handleVideoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor || uploadingRef.current) return
    uploadingRef.current = true
    try {
      const url = await uploadToStorage(file)
      editor.chain().focus().insertContent({ type: 'video', attrs: { src: url } }).run()
    } catch (err) {
      alert('Ошибка загрузки видео: ' + (err as Error).message)
    } finally {
      uploadingRef.current = false
      e.target.value = ''
    }
  }, [editor])

  const setLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href
    const url = window.prompt('URL ссылки', prev ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) return null

  return (
    <div style={{ border: '1px solid #2a2a2a', borderRadius: 4, overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 4, padding: '8px',
        background: '#111', borderBottom: '1px solid #2a2a2a',
      }}>
        {/* Text style */}
        <Btn label="B" title="Жирный" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
        <Btn label="I" title="Курсив" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
        <Btn label="U" title="Подчёркнутый" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} />

        <div style={{ width: 1, background: '#2a2a2a', margin: '0 2px' }} />

        {/* Headings */}
        <Btn label="H1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
        <Btn label="H2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
        <Btn label="H3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />

        <div style={{ width: 1, background: '#2a2a2a', margin: '0 2px' }} />

        {/* Lists */}
        <Btn label="• —" title="Маркированный список" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <Btn label="1." title="Нумерованный список" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />

        <div style={{ width: 1, background: '#2a2a2a', margin: '0 2px' }} />

        {/* Align */}
        <Btn label="≡L" title="По левому краю" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} />
        <Btn label="≡C" title="По центру" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} />
        <Btn label="≡R" title="По правому краю" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} />

        <div style={{ width: 1, background: '#2a2a2a', margin: '0 2px' }} />

        {/* Quote + HR */}
        <Btn label="❝" title="Цитата" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <Btn label="—" title="Горизонтальная линия" onClick={() => editor.chain().focus().setHorizontalRule().run()} />

        {/* Link */}
        <Btn label="🔗" title="Ссылка" active={editor.isActive('link')} onClick={setLink} />

        <div style={{ width: 1, background: '#2a2a2a', margin: '0 2px' }} />

        {/* Media upload */}
        <button
          type="button"
          title="Загрузить изображение"
          onClick={() => imageInputRef.current?.click()}
          style={{
            padding: '4px 10px', height: 28,
            background: '#1a2a1a', border: '1px solid #2a4a2a',
            borderRadius: 3, color: '#6B935C', cursor: 'pointer',
            fontFamily: 'monospace', fontSize: '11px', flexShrink: 0,
          }}
        >
          + Фото
        </button>
        <button
          type="button"
          title="Загрузить видео"
          onClick={() => videoInputRef.current?.click()}
          style={{
            padding: '4px 10px', height: 28,
            background: '#1a1a2a', border: '1px solid #2a2a4a',
            borderRadius: 3, color: '#7B6FE8', cursor: 'pointer',
            fontFamily: 'monospace', fontSize: '11px', flexShrink: 0,
          }}
        >
          + Видео
        </button>

        <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
        <input ref={videoInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={handleVideoUpload} />
      </div>

      {/* Editor area */}
      <div className="rich-editor">
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .rich-editor .tiptap {
          min-height: 180px;
          padding: 12px 14px;
          background: #1a1a1a;
          color: #d0d0d0;
          font-family: system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.7;
          outline: none;
        }
        .rich-editor .tiptap h1 { font-size: 1.5em; color: #e8e8e8; margin: 1em 0 0.4em; }
        .rich-editor .tiptap h2 { font-size: 1.25em; color: #e0e0e0; margin: 0.9em 0 0.35em; }
        .rich-editor .tiptap h3 { font-size: 1.1em; color: #ddd; margin: 0.8em 0 0.3em; }
        .rich-editor .tiptap p { margin: 0 0 0.6em; }
        .rich-editor .tiptap ul, .rich-editor .tiptap ol { padding-left: 1.5em; margin: 0.4em 0; }
        .rich-editor .tiptap li { margin-bottom: 0.2em; }
        .rich-editor .tiptap blockquote { border-left: 3px solid #6B935C; margin: 0.8em 0; padding: 0.4em 1em; color: #888; font-style: italic; }
        .rich-editor .tiptap hr { border: none; border-top: 1px solid #333; margin: 1em 0; }
        .rich-editor .tiptap a { color: #6B935C; text-decoration: underline; }
        .rich-editor .tiptap img { max-width: 100%; border-radius: 4px; margin: 0.6em 0; display: block; }
        .rich-editor .tiptap video { max-width: 100%; border-radius: 4px; margin: 0.6em 0; display: block; }
        .rich-editor .tiptap strong { color: #f0f0f0; }
        .rich-editor .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #444;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  )
}
