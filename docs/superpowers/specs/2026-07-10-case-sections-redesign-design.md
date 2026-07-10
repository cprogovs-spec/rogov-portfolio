# Редизайн разделов кейсов: Анимация + Логотипы

## Контекст

Сайт-портфолио byrogov.ru имеет пять горизонтально пролистываемых экранов на десктопе (Header, ВЕБ, НЕЙРОСЕТИ, МОУШЕН, СТАТЬИ, КОНТАКТЫ) и аналогичные вертикальные вкладки на мобиле. Раздел «Нейросети» убирается, «Моушен» переименовывается в «Анимация» с новым layout, добавляется новый раздел «Логотипы».

## Итоговая структура разделов

Десктоп: **ВЕБ → АНИМАЦИЯ → ЛОГОТИПЫ → СТАТЬИ → КОНТАКТЫ**
Мобайл (табы): те же 5 + ГЛАВНАЯ.

## Данные (Supabase)

### Таблица `cases` (существующая)
- `section` теперь принимает `'webdesign' | 'motion'` (значение `'ai'` выводится из UI)
- Новое поле `format: 'horizontal' | 'vertical'` (16:9 / 9:16), применяется к разделу `motion` (Анимация). Управляется в админке per-кейс.

### Новая таблица `logos`
```sql
create table logos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  name text not null,
  year text,
  comment text,
  size text default 'normal', -- 'normal' | 'wide' (bento 1x1 / 2x1)
  accent text default '#6B935C', -- фон плитки
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz default now()
);
```

## Компоненты

### 1. WebDesignSection — без изменений
Остаётся как есть (двухколоночный expanded, карточки как сейчас).

### 2. Раздел «Анимация» (переименованный MotionSection)
- Сетка карточек: CSS grid с `grid-auto-flow: dense`, карточки формата `horizontal` занимают 2 колонки условной сетки (4 колонки на десктопе), `vertical` — 1 колонку, но выше по строкам (row-span 2).
- Авто-расчёт вместимости страницы: считаем сколько карточек помещается в доступную высоту секции (100vh минус хедер/паддинги) без внутреннего скролла; остаток уходит на следующую страницу.
- Expanded-кейс — тот же двухколоночный layout, что и у ВЕБ/НЕЙРО (текст слева / медиа-галерея с подписями справа).
- Пагинация внизу секции (общий компонент, см. ниже).

### 3. Раздел «Логотипы» (новый LogoSection)
- Bento-сетка: карточки `normal` (1×1, квадрат) и `wide` (2×1), фон плитки — `accent` цвет или тёмный по умолчанию, логотип по центру (PNG/SVG с прозрачностью).
- Hover: `translateY(-4px)`, рамка подсвечивается accent-цветом, снизу выезжает подпись (имя + год) поверх полупрозрачного оверлея.
- Клик → лёгкий lightbox (не полноэкранный expanded): затемнённый фон с блюром, по центру увеличенная плитка (логотип крупно), под ней имя, год, короткий комментарий, кнопка закрытия + Escape.
- Пагинация как в Анимации.
- Мобильная версия: bento-сетка 2 колонки, вертикальный скролл без пагинации (как остальные мобильные разделы), клик открывает тот же lightbox.

### 4. Общий компонент пагинации `<CasesPagination>`
- Используется в ВЕБ, АНИМАЦИЯ, ЛОГОТИПЫ, СТАТЬИ (только десктоп).
- UI: точки/номера страниц внизу секции.
- Переход между страницами: текущая сетка fade-out (opacity 1→0, translateY 0→-10px, 200ms), новая сетка **выезжает снизу**: translateY(40px)→0, opacity 0→1, 350ms ease-out.
- Хук `usePagination(items, itemsPerPage)` возвращает `{ page, setPage, pageItems, totalPages }`.
- `itemsPerPage` — фиксированное число на первой итерации (не DOM-расчёт): 6 карточек ВЕБ, 6 АНИМАЦИЯ (с учётом occupancy widescreen=2slots/vertical=1slot, ограничение по сумме слотов ≈8), 10 ЛОГОТИПЫ, 6 СТАТЬИ.

## Админка

### Вкладки разделов кейсов
Заменить `'webdesign' | 'ai' | 'motion'` на `'webdesign' | 'motion' | 'logos'`.

### Форма кейса «Анимация»
Добавить переключатель **Формат**: `16:9 (широкий)` / `9:16 (вертикальный)`.

### Новый раздел «Логотипы» в админке
CRUD для таблицы `logos`: загрузка изображения (файл/URL), имя, год, комментарий, размер плитки (обычный/широкий), акцентный цвет фона, published, sort_order.

## Навигация (лейблы)
- `BottomNav.tsx`: `['ВЕБ-ДИЗАЙН', 'АНИМАЦИЯ', 'ЛОГОТИПЫ', 'ПОЛЕЗНОЕ', 'КОНТАКТЫ']`
- `MobileTabBar.tsx`: `ai` таб → удаляется, `motion` → label `АНИМАЦИЯ`, добавляется таб `logos` → label `ЛОГО`.
- `page.tsx` / `MobileLayout.tsx`: заменить `AiSection`/`MobileAiSection` на `LogoSection`/`MobileLogoSection`, `MotionSection` переименовать в тексте на «Анимация».

## Затронутые файлы
- `src/components/MotionSection.tsx` → рефактор (сетка, формат, пагинация)
- `src/components/AiSection.tsx` → удаляется
- `src/components/LogoSection.tsx` → новый (bento + lightbox + пагинация)
- `src/components/mobile/MobileAiSection.tsx` → удаляется
- `src/components/mobile/MobileLogoSection.tsx` → новый
- `src/components/mobile/MobileMotionSection.tsx` → обновить label
- `src/components/CasesPagination.tsx` → новый общий компонент
- `src/components/WebDesignSection.tsx`, `src/components/UsefulSection.tsx` → добавить пагинацию
- `src/components/BottomNav.tsx`, `src/components/mobile/MobileTabBar.tsx` → обновить лейблы
- `src/app/page.tsx`, `src/components/mobile/MobileLayout.tsx` → обновить импорты
- `src/app/admin/dashboard/page.tsx` → обновить вкладки, добавить форму логотипов и формат-переключатель
- Supabase: миграция — добавить `format` в `cases`, создать таблицу `logos` + Storage для логотипов (использовать существующий bucket `media`)

## Тестирование
- Ручная проверка в превью (desktop + resize mobile): переключение страниц пагинации, hover/lightbox логотипов, Escape закрывает lightbox, формат-переключатель в админке сохраняется и влияет на сетку.
- TypeScript check (`tsc --noEmit`) перед каждым коммитом.
