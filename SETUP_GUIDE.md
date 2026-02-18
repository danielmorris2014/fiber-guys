# How to Use These Files with Claude Code

## Setup Steps

### 1. Create your project directory
```bash
mkdir fiber-guys && cd fiber-guys
```

### 2. Copy CLAUDE.md into the repo root
Place the `CLAUDE.md` file at the root of your `fiber-guys/` directory.
Claude Code automatically reads CLAUDE.md from the project root — it acts as a persistent constitution for the entire project.

### 3. Start Claude Code in Plan Mode
```bash
claude
```
Then type `/plan` to enter plan mode, or start Claude Code with:
```bash
claude --plan
```

### 4. Paste the Master Prompt
Open `MASTER_PROMPT.md`, copy the entire contents (everything below the `---` line), and paste it as your first message in Claude Code.

### 5. Let it run
Claude Code will:
1. Read CLAUDE.md automatically
2. Research best practices using web tools
3. Produce a detailed plan
4. Ask you to approve the plan
5. Implement the full codebase
6. Run build/typecheck verification

### 6. After initial build — refinement prompts
Once the initial build is done, use these targeted prompts to push specific areas:

**If the gallery feels basic:**
```
The gallery doesn't feel Awwwards-level yet. Focus ONLY on upgrading the gallery experience:
- Make the masonry layout feel more dynamic
- Ensure the lightbox transition from thumbnail is buttery smooth (use layoutId)
- The custom cursor should feel polished, not hacky
- Hover states need to be more cinematic
Show me what changes you'd make, then implement them.
```

**If motion feels generic:**
```
The animations feel too template-y. Upgrade the motion system:
- The signal-line hero animation should feel like fiber routing through conduit
- Scroll reveals need better stagger timing and easing
- Magnetic buttons should have a noticeable but tasteful pull
- Page transitions need the orange signal-line sweep
Focus on making motion feel engineered and precise, not bouncy.
```

**If the form feels basic:**
```
The Request a Crew form needs to feel premium. Upgrade it:
- Better visual sectioning (not just a stack of inputs)
- The file upload area should feel like a product feature, not an afterthought
- Add micro-interactions: focus glow, validation transitions
- Success state should feel satisfying
```

**If typography/spacing feels cramped:**
```
The typography and spacing aren't dramatic enough for Awwwards. Fix:
- H1 should be 64-84px desktop, much bolder
- Section padding should be 120-160px vertical minimum
- More negative space between elements
- Captions should be smaller, uppercase, wider tracking
Reference the design tokens in CLAUDE.md.
```

## Tips for Best Results

- **Don't interrupt the plan phase** — let Claude Code finish its research and plan before you give feedback
- **Review the plan before approving implementation** — this is your chance to catch wrong directions
- **One refinement at a time** — don't paste 5 issues in one message, focus on one area per prompt
- **Show don't tell** — if something doesn't look right, describe what you see vs what you want
- **Add real assets early** — drop your real photos into `/public/images/gallery/` and your logo into `/public/brand/` as soon as possible. Placeholder paths are wired up, you just need to swap files.

## Asset Checklist (What You'll Need)

To make this site actually look Awwwards-level, you need real media:

### Must-have
- [ ] Company logo (transparent PNG, white version, mark-only version)
- [ ] Favicon (32x32 and 192x192)
- [ ] 20-30 high-res photos for gallery
- [ ] 1 hero video loop (6-12 seconds, stabilized) OR accept the gradient fallback

### Photo shot list (what makes galleries look premium)
- Wide jobsite shots (40%)
- Detail shots: fiber entering conduit, splice trays, labeling, clean handholes (40%)
- Crew/equipment "portrait" shots (20%)

Even phone footage works if it's stabilized and color-corrected slightly.
