# Code Katz — Visual Style Guide

> **Applies to all projects in the Code Katz suite.**

---

## 1. Brand Identity

### 1.1 Suite Name

The seven projects form a single suite under the **Code Katz** brand (`codekatz.com`). Each project retains its own name but shares this visual identity.

| Project | Short Label | Accent Color | Role |
|---|---|---|---|
| `claude-team-cli` | **Team CLI** | Rust Orange `#d97757` | Multi-agent orchestration from the terminal |
| `claude-conductor` | **Conductor** | Amber Gold `#d4a843` | Coordinate parallel Claude Code sessions |
| `claude-devlog-skill` | **Devlog Skill** | Slate Blue `#6a9bcc` | Structured development changelog skill |
| `claude-roadmap-skill` | **Roadmap Skill** | Sage Green `#788c5d` | Project planning and roadmap skill |
| `claude-publish-agent` | **Publish Agent** | Muted Purple `#8b7eb8` | Publish markdown to blogging platforms |
| `claude-plans-skill` | **Plans Skill** | Soft Teal `#7ab5b0` | Archive and retrieve implementation plans |
| `claude-todo-skill` | **Todo Skill** | Warm Tan `#c4a882` | Lightweight task scratchpad |

---

## 2. Color Palette

### 2.1 Primary Colors

Foundation colors used across all projects.

| Name | Hex | Usage |
|---|---|---|
| **Charcoal** | `#141413` | Primary text, dark backgrounds |
| **Warm White** | `#faf9f5` | Light backgrounds, text on dark |
| **Mid Gray** | `#b0aea5` | Secondary text, borders, dividers |
| **Light Gray** | `#e8e6dc` | Subtle backgrounds, code blocks |

### 2.2 Accent Colors

Each project has a designated accent for visual distinction.

| Name | Hex | Assigned To |
|---|---|---|
| **Rust Orange** | `#d97757` | `claude-team-cli` |
| **Amber Gold** | `#d4a843` | `claude-conductor` |
| **Slate Blue** | `#6a9bcc` | `claude-devlog-skill` |
| **Sage Green** | `#788c5d` | `claude-roadmap-skill` |
| **Muted Purple** | `#8b7eb8` | `claude-publish-agent` |
| **Soft Teal** | `#7ab5b0` | `claude-plans-skill` |
| **Warm Tan** | `#c4a882` | `claude-todo-skill` |

---

## 3. Typography

### 3.1 Fonts

| Context | Font | Fallback |
|---|---|---|
| **Headings** | Poppins (SemiBold 600) | Arial, Helvetica |
| **Body Text** | Lora (Regular 400) | Georgia, serif |
| **Code / Project Names** | JetBrains Mono | Fira Code, Consolas, monospace |

### 3.2 Project Name Rendering

Project names should always be rendered in **monospace** with their accent color:

- `claude-team-cli` → JetBrains Mono, `#d97757`
- `claude-conductor` → JetBrains Mono, `#d4a843`
- `claude-devlog-skill` → JetBrains Mono, `#6a9bcc`
- `claude-roadmap-skill` → JetBrains Mono, `#788c5d`
- `claude-publish-agent` → JetBrains Mono, `#8b7eb8`
- `claude-plans-skill` → JetBrains Mono, `#7ab5b0`
- `claude-todo-skill` → JetBrains Mono, `#c4a882`

In Markdown contexts where color isn't available, use inline code formatting: `` `claude-team-cli` ``

---

## 4. GitHub README Headers

### 4.1 Format

Each repo gets an SVG header banner (1280x320px) with:

- Dark background (`#141413`)
- Project name in monospace, colored with its accent
- A subtle tagline beneath in `#b0aea5`
- No logos, no icons — just clean typographic treatment

### 4.2 Placement

```markdown
<p align="center">
  <img src="publish/images/{project}-header.svg" alt="{project}" width="100%">
</p>
```

### 4.3 File Location

Store headers at `publish/images/{project}-header.svg` in each repo.

---

## 5. Image Style

### 5.1 General Style

All illustrations follow a **flat vector / minimal cartoon** style:

- Clean white or `#faf9f5` backgrounds — no gradients, no textures
- Simple geometric shapes — circles, rounded rectangles, soft edges
- Flat coloring — no shadows, no 3D effects, no gradients
- Minimal detail — convey the concept, not photorealism
- Outlined icons preferred over filled (2px stroke weight)
- Consistent character style — if people appear, use simple silhouettes or avatar-style figures

### 5.2 Prompt Template for Image Generation

When generating images with AI tools, prepend this base prompt:

```
Simple, clean flat vector illustration on a white (#faf9f5) background.
Minimal detail, soft muted colors (palette: #d97757, #6a9bcc, #788c5d,
#8b7eb8, #7ab5b0, #c4a882, #141413). No text. No logos. Rounded shapes,
2px outlines, no gradients or shadows. Suitable for a tech blog header.
```

### 5.3 Image Inventory

| Image | Size | Subject | Usage |
|---|---|---|---|
| Suite Header | 1400x800 | Developer at desk with laptop; specialist icons in a semicircle above the screen | Medium article hero |
| Architecture Overview | 1200x675 | System diagram showing six tools connected with arrows | Medium article, README |
| CLI in Action | 1200x675 | Stylized terminal window with agent avatars beside output | team-cli README, Medium |
| Devlog Concept | 1200x675 | Notebook/scroll with milestone markers and decision branches | devlog-skill README, Medium |
| Roadmap Concept | 1200x675 | Winding road/timeline with milestone flags and branching paths | roadmap-skill README, Medium |
| Workflow | 1200x675 | Step-by-step flow: prompt → delegation → execution → output | Medium article |
| Extensibility | 1200x675 | Puzzle pieces snapping together; one highlighted as "your custom skill" | Medium conclusion, contributing docs |

---

## 6. Diagram Style (Mermaid / SVG)

When creating technical diagrams:

- Use **LR (left-to-right)** direction for flowcharts
- Node fill colors should use the accent color of the relevant project
- Edge/arrow color: `#b0aea5`
- Text in nodes: `#141413` on light fills, `#faf9f5` on dark fills
- Keep diagrams to 10 nodes or fewer for readability
- Rounded rectangle nodes preferred

---

## 7. Do's and Don'ts

**Do:**
- Use the designated accent color for each project consistently
- Keep illustrations simple — if it takes more than 3 seconds to "get it," simplify
- Maintain generous whitespace in all visuals
- Use monospace for all project name references
- Keep GitHub headers typographic only (no icons/illustrations)

**Don't:**
- Don't use gradients, drop shadows, or 3D effects
- Don't mix accent colors within a single project's context
- Don't use photography or realistic illustrations
- Don't add the Anthropic logo (independent community project)
- Don't use more than 3 colors in a single illustration (pick from the palette)

---

## 8. File Naming Convention

```
{project-short-name}-{description}-{size}.{ext}
```

Examples:
- `team-cli-header-1280x320.svg`
- `suite-architecture-1200x675.png`
- `devlog-concept-1200x675.png`

---

## 9. Publish Directory Structure

Each repo follows this convention:

```
publish/
├── images/
│   └── {project}-header.svg
└── posts/                      # gitignored — draft blog posts stay local
```

The style guide lives at the org level (`code-katz/style-guide.md`), not in individual repos.

---

*Last updated: March 2026*
