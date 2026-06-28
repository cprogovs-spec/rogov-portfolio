'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import RichTextEditor from '@/components/admin/RichTextEditor'

async function uploadMediaFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'bin'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('media').upload(path, file, { upsert: false })
  if (error) throw new Error(error.message)
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl
}

// ─── Types ───────────────────────────────────────────────────────────────────
type MediaItem = { url: string; type: 'image' | 'video' }

type Case = {
  id: string
  section: string
  title: string
  year: string
  tags: string[]
  description: string
  full_desc: string
  accent: string
  size: string
  role_label: string
  duration: string
  cover_url: string
  cover_type: string
  stat_value: string
  stat_label: string
  colors: string[]
  media: MediaItem[]
  sort_order: number
  published: boolean
}

type Article = {
  id: string
  title: string
  date: string
  tags: string[]
  preview: string
  body: string
  published: boolean
  sort_order: number
}

const SECTION_MAP: Record<string, string> = {
  webdesign: 'ВЕБ-ДИЗАЙН',
  ai: 'НЕЙРОСЕТИ',
  motion: 'МОУШЕН',
}

const EMPTY_CASE: Omit<Case, 'id'> = {
  section: 'webdesign',
  title: '',
  year: new Date().getFullYear().toString(),
  tags: [],
  description: '',
  full_desc: '',
  accent: '#6B935C',
  size: 'small',
  role_label: '',
  duration: '',
  cover_url: '',
  cover_type: 'image',
  stat_value: '',
  stat_label: '',
  colors: [],
  media: [],
  sort_order: 0,
  published: true,
}

const EMPTY_ARTICLE: Omit<Article, 'id'> = {
  title: '',
  date: new Date().toISOString().split('T')[0],
  tags: [],
  preview: '',
  body: '',
  published: true,
  sort_order: 0,
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0d0d0d',
    color: '#e0e0e0',
    fontFamily: 'system-ui, monospace',
    fontSize: '14px',
  } as React.CSSProperties,
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid #222',
    backgroundColor: '#111',
  } as React.CSSProperties,
  topbarTitle: {
    color: '#6B935C',
    fontSize: '15px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    fontFamily: 'monospace',
  } as React.CSSProperties,
  content: { padding: '24px' } as React.CSSProperties,
  tabs: { display: 'flex', gap: '4px', marginBottom: '24px' } as React.CSSProperties,
  tab: (active: boolean): React.CSSProperties => ({
    padding: '8px 20px',
    border: '1px solid ' + (active ? '#6B935C' : '#2a2a2a'),
    backgroundColor: active ? '#6B935C' : 'transparent',
    color: active ? '#fff' : '#888',
    cursor: 'pointer',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '12px',
    letterSpacing: '0.05em',
  }),
  subTabs: { display: 'flex', gap: '4px', marginBottom: '20px' } as React.CSSProperties,
  subTab: (active: boolean): React.CSSProperties => ({
    padding: '6px 16px',
    border: '1px solid ' + (active ? '#444' : '#222'),
    backgroundColor: active ? '#1e1e1e' : 'transparent',
    color: active ? '#e0e0e0' : '#555',
    cursor: 'pointer',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '11px',
  }),
  btn: {
    padding: '7px 14px',
    backgroundColor: '#6B935C',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: '12px',
    letterSpacing: '0.03em',
  } as React.CSSProperties,
  btnDanger: {
    padding: '5px 10px',
    backgroundColor: '#933a3a',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: '11px',
  } as React.CSSProperties,
  btnSecondary: {
    padding: '7px 14px',
    backgroundColor: 'transparent',
    color: '#888',
    border: '1px solid #333',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: '12px',
  } as React.CSSProperties,
  btnSmall: {
    padding: '4px 10px',
    backgroundColor: '#1e3a2e',
    color: '#6B935C',
    border: '1px solid #2a4a35',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: '11px',
    marginRight: '6px',
  } as React.CSSProperties,
  table: { width: '100%', borderCollapse: 'collapse' as const },
  th: {
    textAlign: 'left' as const,
    padding: '8px 12px',
    borderBottom: '1px solid #222',
    color: '#555',
    fontSize: '11px',
    letterSpacing: '0.08em',
    fontFamily: 'monospace',
  } as React.CSSProperties,
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #1a1a1a',
    verticalAlign: 'middle' as const,
  } as React.CSSProperties,
  input: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '4px',
    color: '#fff',
    padding: '8px 10px',
    fontSize: '13px',
    fontFamily: 'system-ui',
    boxSizing: 'border-box' as const,
    outline: 'none',
  } as React.CSSProperties,
  textarea: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '4px',
    color: '#fff',
    padding: '8px 10px',
    fontSize: '13px',
    fontFamily: 'system-ui',
    boxSizing: 'border-box' as const,
    outline: 'none',
    resize: 'vertical' as const,
    minHeight: '80px',
  } as React.CSSProperties,
  label: {
    color: '#888',
    fontSize: '11px',
    display: 'block',
    marginBottom: '5px',
    letterSpacing: '0.05em',
    fontFamily: 'monospace',
  } as React.CSSProperties,
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  } as React.CSSProperties,
  formPanel: {
    backgroundColor: '#111',
    border: '1px solid #222',
    borderRadius: '6px',
    padding: '24px',
    marginTop: '20px',
  } as React.CSSProperties,
  formField: { marginBottom: '16px' } as React.CSSProperties,
  tag: {
    display: 'inline-block',
    backgroundColor: '#1a2e1a',
    color: '#6B935C',
    borderRadius: '3px',
    padding: '2px 6px',
    fontSize: '11px',
    marginRight: '4px',
  } as React.CSSProperties,
}

// ─── Case Form ────────────────────────────────────────────────────────────────
function CaseForm({
  initial,
  section,
  onSave,
  onCancel,
}: {
  initial?: Case
  section: string
  onSave: () => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Omit<Case, 'id'>>({
    ...EMPTY_CASE,
    section,
    ...initial,
  })
  const [tagsStr, setTagsStr] = useState((initial?.tags ?? []).join(', '))
  const [colorsStr, setColorsStr] = useState((initial?.colors ?? []).join(', '))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [coverUploading, setCoverUploading] = useState(false)
  const [mediaUploading, setMediaUploading] = useState(false)
  const [mediaUrlInput, setMediaUrlInput] = useState('')
  const coverFileRef = useRef<HTMLInputElement>(null)
  const mediaFileRef = useRef<HTMLInputElement>(null)

  function addMediaByUrl() {
    const url = mediaUrlInput.trim()
    if (!url) return
    const isVideo = /\.(mp4|webm|mov|avi)$/i.test(url)
    set('media', [...(form.media ?? []), { url, type: isVideo ? 'video' : 'image' }])
    setMediaUrlInput('')
  }

  async function handleMediaUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setMediaUploading(true)
    try {
      const newItems: MediaItem[] = await Promise.all(
        files.map(async f => {
          const url = await uploadMediaFile(f)
          return { url, type: f.type.startsWith('video/') ? 'video' as const : 'image' as const }
        })
      )
      set('media', [...(form.media ?? []), ...newItems])
    } catch (err) {
      setError('Ошибка загрузки: ' + (err as Error).message)
    } finally {
      setMediaUploading(false)
      e.target.value = ''
    }
  }

  function removeMedia(index: number) {
    set('media', (form.media ?? []).filter((_, i) => i !== index))
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverUploading(true)
    try {
      const url = await uploadMediaFile(file)
      const isVideo = file.type.startsWith('video/')
      set('cover_url', url)
      set('cover_type', isVideo ? 'video' : 'image')
    } catch (err) {
      setError('Ошибка загрузки: ' + (err as Error).message)
    } finally {
      setCoverUploading(false)
      e.target.value = ''
    }
  }

  function set(field: keyof typeof form, value: unknown) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      section,
      tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
      colors: colorsStr.split(',').map(c => c.trim()).filter(Boolean),
    }
    let err
    if (initial?.id) {
      const res = await supabase.from('cases').update(payload).eq('id', initial.id)
      err = res.error
    } else {
      const res = await supabase.from('cases').insert(payload)
      err = res.error
    }
    setSaving(false)
    if (err) { setError(err.message); return }
    onSave()
  }

  return (
    <div style={S.formPanel}>
      <h3 style={{ color: '#6B935C', marginTop: 0, marginBottom: '20px', fontFamily: 'monospace', fontSize: '13px' }}>
        {initial?.id ? 'РЕДАКТИРОВАТЬ КЕЙС' : 'НОВЫЙ КЕЙС'}
      </h3>
      <div style={S.formGrid}>
        <div style={S.formField}>
          <label style={S.label}>НАЗВАНИЕ</label>
          <input style={S.input} value={form.title} onChange={e => set('title', e.target.value)} />
        </div>
        <div style={S.formField}>
          <label style={S.label}>ГОД</label>
          <input style={S.input} value={form.year} onChange={e => set('year', e.target.value)} />
        </div>
        <div style={S.formField}>
          <label style={S.label}>ТЕГИ (через запятую)</label>
          <input style={S.input} value={tagsStr} onChange={e => setTagsStr(e.target.value)} />
        </div>
        <div style={S.formField}>
          <label style={S.label}>АКЦЕНТ (HEX)</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input type="color" value={form.accent} onChange={e => set('accent', e.target.value)}
              style={{ width: '40px', height: '34px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }} />
            <input style={{ ...S.input, flex: 1 }} value={form.accent} onChange={e => set('accent', e.target.value)} />
          </div>
        </div>
        <div style={S.formField}>
          <label style={S.label}>РОЛЬ</label>
          <input style={S.input} value={form.role_label} onChange={e => set('role_label', e.target.value)} />
        </div>
        <div style={S.formField}>
          <label style={S.label}>ДЛИТЕЛЬНОСТЬ</label>
          <input style={S.input} value={form.duration} onChange={e => set('duration', e.target.value)} />
        </div>
        <div style={{ ...S.formField, gridColumn: 'span 2' }}>
          <label style={S.label}>ОБЛОЖКА (URL или загрузить файл)</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input style={{ ...S.input, flex: 1 }} value={form.cover_url} onChange={e => set('cover_url', e.target.value)} placeholder="https://..." />
            <button type="button" onClick={() => coverFileRef.current?.click()}
              disabled={coverUploading}
              style={{ ...S.btn, whiteSpace: 'nowrap', flexShrink: 0, opacity: coverUploading ? 0.6 : 1 }}>
              {coverUploading ? 'Загрузка...' : '↑ Файл'}
            </button>
            <input ref={coverFileRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleCoverUpload} />
          </div>
          {form.cover_url && (
            <div style={{ marginTop: 8 }}>
              {form.cover_type === 'video'
                ? <video src={form.cover_url} style={{ maxHeight: 80, borderRadius: 4, border: '1px solid #2a2a2a' }} />
                : <img src={form.cover_url} alt="" style={{ maxHeight: 80, borderRadius: 4, border: '1px solid #2a2a2a', objectFit: 'cover' }} />
              }
            </div>
          )}
          <div style={{ display: 'flex', gap: '16px', paddingTop: '8px' }}>
            <span style={{ ...S.label, marginBottom: 0 }}>ТИП:</span>
            {['image', 'video'].map(t => (
              <label key={t} style={{ color: '#aaa', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input type="radio" name="cover_type" value={t} checked={form.cover_type === t} onChange={() => set('cover_type', t)} />
                {t === 'image' ? 'Изображение' : 'Видео'}
              </label>
            ))}
          </div>
        </div>
        <div style={S.formField}>
          <label style={S.label}>ПОРЯДОК СОРТИРОВКИ</label>
          <input type="number" style={S.input} value={form.sort_order}
            onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
        </div>
        {section === 'webdesign' && (
          <div style={S.formField}>
            <label style={S.label}>РАЗМЕР КАРТОЧКИ</label>
            <div style={{ display: 'flex', gap: '16px', paddingTop: '6px' }}>
              {['small', 'large'].map(s => (
                <label key={s} style={{ color: '#aaa', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input type="radio" name="size" value={s} checked={form.size === s} onChange={() => set('size', s)} />
                  {s === 'small' ? 'Маленькая' : 'Большая'}
                </label>
              ))}
            </div>
          </div>
        )}
        {section === 'ai' && (
          <>
            <div style={S.formField}>
              <label style={S.label}>ЗНАЧЕНИЕ СТАТЫ</label>
              <input style={S.input} value={form.stat_value} onChange={e => set('stat_value', e.target.value)} placeholder="напр. 2x" />
            </div>
            <div style={S.formField}>
              <label style={S.label}>ПОДПИСЬ СТАТЫ</label>
              <input style={S.input} value={form.stat_label} onChange={e => set('stat_label', e.target.value)} placeholder="напр. быстрее" />
            </div>
          </>
        )}
        {section === 'motion' && (
          <div style={S.formField}>
            <label style={S.label}>ЦВЕТА (HEX через запятую)</label>
            <input style={S.input} value={colorsStr} onChange={e => setColorsStr(e.target.value)} placeholder="#fff, #000, ..." />
          </div>
        )}
      </div>
      <div style={S.formField}>
        <label style={S.label}>КРАТКОЕ ОПИСАНИЕ</label>
        <textarea style={S.textarea} value={form.description} onChange={e => set('description', e.target.value)} />
      </div>
      <div style={S.formField}>
        <label style={S.label}>ПОЛНОЕ ОПИСАНИЕ</label>
        <RichTextEditor value={form.full_desc} onChange={v => set('full_desc', v)} />
      </div>

      {/* Media gallery */}
      <div style={S.formField}>
        <label style={S.label}>МЕДИА-ГАЛЕРЕЯ (картинки и видео внутри кейса)</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input
            style={{ ...S.input, flex: 1 }}
            value={mediaUrlInput}
            onChange={e => setMediaUrlInput(e.target.value)}
            placeholder="https://... (Enter для добавления)"
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addMediaByUrl() } }}
          />
          <button type="button" onClick={addMediaByUrl} style={S.btnSmall}>+ URL</button>
          <button type="button" onClick={() => mediaFileRef.current?.click()} disabled={mediaUploading}
            style={{ ...S.btn, whiteSpace: 'nowrap', flexShrink: 0, opacity: mediaUploading ? 0.6 : 1 }}>
            {mediaUploading ? 'Загрузка...' : '↑ Файлы'}
          </button>
          <input ref={mediaFileRef} type="file" accept="image/*,video/*" multiple style={{ display: 'none' }} onChange={handleMediaUpload} />
        </div>
        {(form.media ?? []).length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(form.media ?? []).map((item, i) => (
              <div key={i} style={{ position: 'relative', border: '1px solid #2a2a2a', borderRadius: 4, overflow: 'hidden' }}>
                {item.type === 'video'
                  ? <video src={item.url} style={{ width: 100, height: 70, objectFit: 'cover', display: 'block' }} />
                  : <img src={item.url} alt="" style={{ width: 100, height: 70, objectFit: 'cover', display: 'block' }} />
                }
                <button type="button" onClick={() => removeMedia(i)}
                  style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', color: '#fff', cursor: 'pointer', fontSize: 10, lineHeight: '18px', textAlign: 'center', padding: 0 }}>
                  ✕
                </button>
                <div style={{ fontSize: 9, color: '#555', fontFamily: 'monospace', padding: '2px 4px', background: '#0a0a0a' }}>
                  {item.type === 'video' ? 'VIDEO' : 'IMG'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ ...S.formField, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input type="checkbox" id="pub_case" checked={form.published} onChange={e => set('published', e.target.checked)} />
        <label htmlFor="pub_case" style={{ color: '#aaa', fontSize: '13px', cursor: 'pointer' }}>Опубликован</label>
      </div>
      {error && <p style={{ color: '#c0392b', fontSize: '12px', marginBottom: '12px' }}>{error}</p>}
      <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
        <button style={S.btn} onClick={handleSave} disabled={saving}>
          {saving ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ'}
        </button>
        <button style={S.btnSecondary} onClick={onCancel}>ОТМЕНА</button>
      </div>
    </div>
  )
}

// ─── Article Form ─────────────────────────────────────────────────────────────
function ArticleForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Article
  onSave: () => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Omit<Article, 'id'>>({ ...EMPTY_ARTICLE, ...initial })
  const [tagsStr, setTagsStr] = useState((initial?.tags ?? []).join(', '))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(field: keyof typeof form, value: unknown) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
    }
    let err
    if (initial?.id) {
      const res = await supabase.from('articles').update(payload).eq('id', initial.id)
      err = res.error
    } else {
      const res = await supabase.from('articles').insert(payload)
      err = res.error
    }
    setSaving(false)
    if (err) { setError(err.message); return }
    onSave()
  }

  return (
    <div style={S.formPanel}>
      <h3 style={{ color: '#6B935C', marginTop: 0, marginBottom: '20px', fontFamily: 'monospace', fontSize: '13px' }}>
        {initial?.id ? 'РЕДАКТИРОВАТЬ СТАТЬЮ' : 'НОВАЯ СТАТЬЯ'}
      </h3>
      <div style={S.formGrid}>
        <div style={S.formField}>
          <label style={S.label}>НАЗВАНИЕ</label>
          <input style={S.input} value={form.title} onChange={e => set('title', e.target.value)} />
        </div>
        <div style={S.formField}>
          <label style={S.label}>ДАТА</label>
          <input type="date" style={S.input} value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
        <div style={S.formField}>
          <label style={S.label}>ТЕГИ (через запятую)</label>
          <input style={S.input} value={tagsStr} onChange={e => setTagsStr(e.target.value)} />
        </div>
        <div style={S.formField}>
          <label style={S.label}>ПОРЯДОК СОРТИРОВКИ</label>
          <input type="number" style={S.input} value={form.sort_order}
            onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
        </div>
      </div>
      <div style={S.formField}>
        <label style={S.label}>ПРЕВЬЮ</label>
        <textarea style={S.textarea} value={form.preview} onChange={e => set('preview', e.target.value)} />
      </div>
      <div style={S.formField}>
        <label style={S.label}>ТЕКСТ СТАТЬИ</label>
        <RichTextEditor value={form.body} onChange={v => set('body', v)} />
      </div>
      <div style={{ ...S.formField, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input type="checkbox" id="pub_art" checked={form.published} onChange={e => set('published', e.target.checked)} />
        <label htmlFor="pub_art" style={{ color: '#aaa', fontSize: '13px', cursor: 'pointer' }}>Опубликована</label>
      </div>
      {error && <p style={{ color: '#c0392b', fontSize: '12px', marginBottom: '12px' }}>{error}</p>}
      <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
        <button style={S.btn} onClick={handleSave} disabled={saving}>
          {saving ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ'}
        </button>
        <button style={S.btnSecondary} onClick={onCancel}>ОТМЕНА</button>
      </div>
    </div>
  )
}

// ─── Cases Tab ────────────────────────────────────────────────────────────────
function CasesTab() {
  const [activeSection, setActiveSection] = useState<'webdesign' | 'ai' | 'motion'>('webdesign')
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Case | undefined>()

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('cases')
      .select('*')
      .eq('section', activeSection)
      .order('sort_order')
    setCases(data ?? [])
    setLoading(false)
  }, [activeSection])

  useEffect(() => { load() }, [load])

  async function togglePublished(item: Case) {
    await supabase.from('cases').update({ published: !item.published }).eq('id', item.id)
    load()
  }

  async function deleteCase(id: string) {
    if (!confirm('Удалить кейс?')) return
    await supabase.from('cases').delete().eq('id', id)
    load()
  }

  function openNew() { setEditing(undefined); setShowForm(true) }
  function openEdit(c: Case) { setEditing(c); setShowForm(true) }
  function closeForm() { setShowForm(false); setEditing(undefined) }
  function afterSave() { closeForm(); load() }

  return (
    <div>
      <div style={S.subTabs}>
        {(Object.keys(SECTION_MAP) as Array<keyof typeof SECTION_MAP>).map(s => (
          <button key={s} style={S.subTab(activeSection === s)}
            onClick={() => { setActiveSection(s as 'webdesign' | 'ai' | 'motion'); setShowForm(false) }}>
            {SECTION_MAP[s]}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ color: '#555', fontSize: '12px' }}>{cases.length} кейсов</span>
        <button style={S.btn} onClick={openNew}>+ ДОБАВИТЬ КЕЙС</button>
      </div>

      {loading ? (
        <p style={{ color: '#555' }}>Загрузка...</p>
      ) : (
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>НАЗВАНИЕ</th>
              <th style={S.th}>ГОД</th>
              <th style={S.th}>ТЕГИ</th>
              <th style={S.th}>ОПУБЛИКОВАН</th>
              <th style={S.th}>ДЕЙСТВИЯ</th>
            </tr>
          </thead>
          <tbody>
            {cases.length === 0 && (
              <tr><td colSpan={5} style={{ ...S.td, color: '#555', textAlign: 'center', padding: '32px' }}>Нет кейсов</td></tr>
            )}
            {cases.map(c => (
              <tr key={c.id}>
                <td style={S.td}>
                  <span style={{ color: '#e0e0e0' }}>{c.title}</span>
                </td>
                <td style={{ ...S.td, color: '#666' }}>{c.year}</td>
                <td style={S.td}>
                  {c.tags?.slice(0, 3).map(t => <span key={t} style={S.tag}>{t}</span>)}
                </td>
                <td style={S.td}>
                  <button
                    onClick={() => togglePublished(c)}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '3px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      backgroundColor: c.published ? '#1a3a1a' : '#2a1a1a',
                      color: c.published ? '#6B935C' : '#933a3a',
                    }}
                  >
                    {c.published ? 'ДА' : 'НЕТ'}
                  </button>
                </td>
                <td style={S.td}>
                  <button style={S.btnSmall} onClick={() => openEdit(c)}>Изм.</button>
                  <button style={S.btnDanger} onClick={() => deleteCase(c.id)}>Удал.</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <CaseForm
          initial={editing}
          section={activeSection}
          onSave={afterSave}
          onCancel={closeForm}
        />
      )}
    </div>
  )
}

// ─── Articles Tab ─────────────────────────────────────────────────────────────
function ArticlesTab() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Article | undefined>()

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('articles').select('*').order('sort_order')
    setArticles(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function togglePublished(item: Article) {
    await supabase.from('articles').update({ published: !item.published }).eq('id', item.id)
    load()
  }

  async function deleteArticle(id: string) {
    if (!confirm('Удалить статью?')) return
    await supabase.from('articles').delete().eq('id', id)
    load()
  }

  function openNew() { setEditing(undefined); setShowForm(true) }
  function openEdit(a: Article) { setEditing(a); setShowForm(true) }
  function closeForm() { setShowForm(false); setEditing(undefined) }
  function afterSave() { closeForm(); load() }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ color: '#555', fontSize: '12px' }}>{articles.length} статей</span>
        <button style={S.btn} onClick={openNew}>+ ДОБАВИТЬ СТАТЬЮ</button>
      </div>

      {loading ? (
        <p style={{ color: '#555' }}>Загрузка...</p>
      ) : (
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>НАЗВАНИЕ</th>
              <th style={S.th}>ДАТА</th>
              <th style={S.th}>ТЕГИ</th>
              <th style={S.th}>ОПУБЛИКОВАНА</th>
              <th style={S.th}>ДЕЙСТВИЯ</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 && (
              <tr><td colSpan={5} style={{ ...S.td, color: '#555', textAlign: 'center', padding: '32px' }}>Нет статей</td></tr>
            )}
            {articles.map(a => (
              <tr key={a.id}>
                <td style={S.td}><span style={{ color: '#e0e0e0' }}>{a.title}</span></td>
                <td style={{ ...S.td, color: '#666' }}>{a.date}</td>
                <td style={S.td}>
                  {a.tags?.slice(0, 3).map(t => <span key={t} style={S.tag}>{t}</span>)}
                </td>
                <td style={S.td}>
                  <button
                    onClick={() => togglePublished(a)}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '3px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      backgroundColor: a.published ? '#1a3a1a' : '#2a1a1a',
                      color: a.published ? '#6B935C' : '#933a3a',
                    }}
                  >
                    {a.published ? 'ДА' : 'НЕТ'}
                  </button>
                </td>
                <td style={S.td}>
                  <button style={S.btnSmall} onClick={() => openEdit(a)}>Изм.</button>
                  <button style={S.btnDanger} onClick={() => deleteArticle(a.id)}>Удал.</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <ArticleForm
          initial={editing}
          onSave={afterSave}
          onCancel={closeForm}
        />
      )}
    </div>
  )
}

// ─── Contact Tab ─────────────────────────────────────────────────────────────
type ServiceItem = { title: string; desc: string; price: string }
type LinkItem = { label: string; value: string; href: string }

function ContactTab() {
  const [subheading, setSubheading] = useState('')
  const [services, setServices] = useState<ServiceItem[]>([])
  const [links, setLinks] = useState<LinkItem[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('settings').select('*').eq('id', 1).single().then(({ data }) => {
      if (!data) return
      setSubheading(data.subheading ?? '')
      setServices(Array.isArray(data.services) ? data.services : [])
      setLinks(Array.isArray(data.links) ? data.links : [])
    })
  }, [])

  function updateService(i: number, field: keyof ServiceItem, val: string) {
    setServices(s => s.map((item, idx) => idx === i ? { ...item, [field]: val } : item))
  }
  function addService() { setServices(s => [...s, { title: '', desc: '', price: '' }]) }
  function removeService(i: number) { setServices(s => s.filter((_, idx) => idx !== i)) }

  function updateLink(i: number, field: keyof LinkItem, val: string) {
    setLinks(l => l.map((item, idx) => idx === i ? { ...item, [field]: val } : item))
  }
  function addLink() { setLinks(l => [...l, { label: '', value: '', href: '' }]) }
  function removeLink(i: number) { setLinks(l => l.filter((_, idx) => idx !== i)) }

  async function handleSave() {
    setSaving(true); setError(''); setSaved(false)
    const { error: err } = await supabase.from('settings')
      .upsert({ id: 1, subheading, services, links })
    setSaving(false)
    if (err) { setError(err.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const rowStyle: React.CSSProperties = {
    display: 'grid', gap: 8, alignItems: 'center',
    background: '#111', border: '1px solid #1e1e1e',
    borderRadius: 4, padding: '10px 12px', marginBottom: 8,
  }

  return (
    <div>
      <div style={S.formPanel}>
        <h3 style={{ color: '#6B935C', marginTop: 0, marginBottom: 20, fontFamily: 'monospace', fontSize: 13 }}>СТРАНИЦА КОНТАКТОВ</h3>

        {/* Subheading */}
        <div style={S.formField}>
          <label style={S.label}>ПОДЗАГОЛОВОК (текст под кнопкой)</label>
          <textarea style={{ ...S.textarea, minHeight: 60 }} value={subheading}
            onChange={e => setSubheading(e.target.value)} />
        </div>

        {/* Services */}
        <div style={{ ...S.formField, marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <label style={{ ...S.label, marginBottom: 0 }}>УСЛУГИ И ЦЕНЫ</label>
            <button style={S.btnSmall} onClick={addService}>+ Добавить</button>
          </div>
          {services.map((s, i) => (
            <div key={i} style={{ ...rowStyle, gridTemplateColumns: '1fr 2fr 1fr auto' }}>
              <input style={S.input} placeholder="Название" value={s.title}
                onChange={e => updateService(i, 'title', e.target.value)} />
              <input style={S.input} placeholder="Описание" value={s.desc}
                onChange={e => updateService(i, 'desc', e.target.value)} />
              <input style={S.input} placeholder="Цена" value={s.price}
                onChange={e => updateService(i, 'price', e.target.value)} />
              <button style={S.btnDanger} onClick={() => removeService(i)}>✕</button>
            </div>
          ))}
        </div>

        {/* Links */}
        <div style={{ ...S.formField, marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <label style={{ ...S.label, marginBottom: 0 }}>КОНТАКТЫ И ССЫЛКИ</label>
            <button style={S.btnSmall} onClick={addLink}>+ Добавить</button>
          </div>
          {links.map((l, i) => (
            <div key={i} style={{ ...rowStyle, gridTemplateColumns: '1fr 1fr 2fr auto' }}>
              <input style={S.input} placeholder="Метка" value={l.label}
                onChange={e => updateLink(i, 'label', e.target.value)} />
              <input style={S.input} placeholder="Текст" value={l.value}
                onChange={e => updateLink(i, 'value', e.target.value)} />
              <input style={S.input} placeholder="https://..." value={l.href}
                onChange={e => updateLink(i, 'href', e.target.value)} />
              <button style={S.btnDanger} onClick={() => removeLink(i)}>✕</button>
            </div>
          ))}
        </div>

        {error && <p style={{ color: '#c0392b', fontSize: 12, marginBottom: 12 }}>{error}</p>}
        <button style={{ ...S.btn, opacity: saving ? 0.6 : 1 }} onClick={handleSave} disabled={saving}>
          {saving ? 'СОХРАНЕНИЕ...' : saved ? '✓ СОХРАНЕНО' : 'СОХРАНИТЬ'}
        </button>
      </div>
    </div>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [tab, setTab] = useState<'cases' | 'articles' | 'contact'>('cases')
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin')
  }

  return (
    <div style={S.page}>
      <div style={S.topbar}>
        <span style={S.topbarTitle}>АДМИНКА — РОГОВ</span>
        <button style={S.btnSecondary} onClick={handleLogout}>Выйти</button>
      </div>
      <div style={S.content}>
        <div style={S.tabs}>
          <button style={S.tab(tab === 'cases')} onClick={() => setTab('cases')}>КЕЙСЫ</button>
          <button style={S.tab(tab === 'articles')} onClick={() => setTab('articles')}>СТАТЬИ</button>
          <button style={S.tab(tab === 'contact')} onClick={() => setTab('contact')}>КОНТАКТЫ</button>
        </div>
        {tab === 'cases' && <CasesTab />}
        {tab === 'articles' && <ArticlesTab />}
        {tab === 'contact' && <ContactTab />}
      </div>
    </div>
  )
}
