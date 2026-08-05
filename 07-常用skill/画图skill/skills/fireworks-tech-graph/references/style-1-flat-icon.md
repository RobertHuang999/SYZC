# Style 1: Flat Icon (Default)

Inspired by draw.io defaults and Apple documentation style.

## QiaoJi Project Variant

When the current project is QiaoJi, keep the flat-icon composition but remap the palette and typography to the project preset in `../../references/qiaoji-default-style.md`.

Use these overrides:

```
Background:     #F8FAFC
Box fill:       #FFFFFF
Box stroke:     rgba(30,41,59,0.12)
Primary text:   #1E293B
Secondary text: #475569
Primary accent: #3087F5
AI cyan:        #22D3EE
AI violet:      #7C3AED
AI mint:        #22C55E
Warning:        #F59E0B
Error:          #EF4444
```

Typography override:

```
font-family: "Nunito", "Quicksand", "Outfit", "PingFang SC",
             "HarmonyOS Sans", "Microsoft YaHei", sans-serif
font-size:   14px labels, 12px sub-labels, 16px titles
font-weight: 400 normal, 600 semi-bold for titles
```

Additional QiaoJi rules:

- Do not switch the whole diagram into dark mode unless the user explicitly asks
- Do not use red / purple / green as parallel default lane colors for all flows
- Reserve violet and cyan for AI-related signals
- Prefer `#3087F5` as the main flow color for primary product paths

## Colors

```
Background:     #ffffff
Box fill:       #ffffff
Box stroke:     #d1d5db  (gray-300)
Box radius:     8px
Text primary:   #111827  (gray-900)
Text secondary: #6b7280  (gray-500)

Semantic arrow colors (pick by flow type):
  Flow A (main):   #2563eb  (blue-600)
  Flow B (alt):    #dc2626  (red-600)
  Flow C (data):   #16a34a  (green-600)
  Flow D (async):  #9333ea  (purple-600)

Icon accent backgrounds:
  Blue tint:   #eff6ff / #dbeafe
  Red tint:    #fef2f2 / #fee2e2
  Green tint:  #f0fdf4 / #dcfce7
  Purple tint: #faf5ff / #ede9fe
  Orange tint: #fff7ed / #fed7aa
  Teal tint:   #f0fdfa / #ccfbf1
```

## Typography

```
font-family: 'Helvetica Neue', Helvetica, Arial, 'PingFang SC',
             'Microsoft YaHei', 'Microsoft JhengHei', 'SimHei', sans-serif
font-size:   14px labels, 12px sub-labels, 16px titles
font-weight: 400 normal, 600 semi-bold for titles
```

## Box Shapes

```xml
<!-- Standard node box -->
<rect rx="8" ry="8" fill="#ffffff" stroke="#d1d5db" stroke-width="1.5"/>

<!-- Icon accent box (colored background) -->
<rect rx="8" ry="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5"/>

<!-- Database cylinder (use SVG path) -->
<!-- Terminal box: rx=4, fill=#111827, stroke=#374151 -->
<!-- User/actor: circle or rounded rect with icon -->
```

## Arrows

```xml
<defs>
  <marker id="arrow-blue" markerWidth="10" markerHeight="7"
          refX="9" refY="3.5" orient="auto">
    <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb"/>
  </marker>
  <marker id="arrow-red" markerWidth="10" markerHeight="7"
          refX="9" refY="3.5" orient="auto">
    <polygon points="0 0, 10 3.5, 0 7" fill="#dc2626"/>
  </marker>
</defs>

<!-- Line -->
<line stroke="#2563eb" stroke-width="1.5" marker-end="url(#arrow-blue)"/>
<!-- Or path for curved/orthogonal routing -->
<path stroke="#2563eb" stroke-width="1.5" fill="none" marker-end="url(#arrow-blue)"/>
```

## Legend

Always include a legend in the bottom-left if multiple arrow colors are used:

```xml
<g transform="translate(20, 560)">
  <line x1="0" y1="8" x2="30" y2="8" stroke="#2563eb" stroke-width="1.5"
        marker-end="url(#arrow-blue)"/>
  <text x="36" y="12" fill="#6b7280" font-size="12">Agent flow</text>
  <line x1="0" y1="24" x2="30" y2="24" stroke="#dc2626" stroke-width="1.5"
        marker-end="url(#arrow-red)"/>
  <text x="36" y="28" fill="#6b7280" font-size="12">RAG flow</text>
</g>
```

## SVG Template

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600" 
     width="960" height="600">
  <style>
    /* NO @import — cairosvg / rsvg-convert cannot fetch external URLs */
    text { font-family: 'Helvetica Neue', Helvetica, Arial, 'PingFang SC', 'Microsoft YaHei', 'Microsoft JhengHei', 'SimHei', sans-serif; }
  </style>
  <defs>
    <!-- arrow markers here -->
    <!-- gradients/filters if needed -->
  </defs>
  <!-- white background -->
  <rect width="960" height="600" fill="#ffffff"/>
  <!-- diagram title (optional) -->
  <!-- nodes -->
  <!-- edges -->
  <!-- legend -->
</svg>
```
