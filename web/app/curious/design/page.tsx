import type { Metadata } from "next";
import { Code, Key, Panel } from "@/components/curious-bits";

export const metadata: Metadata = {
  title: "Design system",
  description:
    "The tokens, typography, and components Sargam is built from — Deep Obsidian Velvet " +
    "and Radiant Luminous Amber in OKLCH, Figtree, and shadcn on Base UI.",
};

/**
 * What the app is made of, for anyone who wants to know.
 *
 * Every value here is read from the real source — globals.css, layout.tsx,
 * package.json — rather than described from memory. A page that documents a
 * design system and then drifts from it is worse than no page, so the swatches
 * carry the actual token names and anyone can check them.
 */

const PALETTE = [
  { token: "--primary", value: "oklch(0.82 0.16 75)", name: "Radiant Amber", note: "Primary actions, play button, and luminous focus highlights" },
  { token: "--heart", value: "oklch(0.72 0.20 18)", name: "Restrained Crimson", note: "Favourites only. Warm rose-crimson tuned to amber lightness" },
  { token: "--background", value: "oklch(0.14 0.016 260)", name: "Deep Obsidian Velvet", note: "The deep midnight listening room the entire app sits in" },
  { token: "--sidebar", value: "oklch(0.10 0.014 260)", name: "Obsidian Rail", note: "Darker indigo-slate tone so navigation recedes elegantly" },
  { token: "--card", value: "oklch(0.185 0.018 260)", name: "Elevated Slate", note: "Soft glass-like panels, elevated cards and dialogs" },
  { token: "--popover", value: "oklch(0.185 0.018 260)", name: "Popover", note: "Flyouts, floating menus and contextual overlays" },
  { token: "--foreground", value: "oklch(0.96 0.008 260)", name: "Luminous White", note: "Primary headings and song titles with WCAG AAA clarity" },
  { token: "--muted-foreground", value: "oklch(0.72 0.015 260)", name: "Slate Muted", note: "Second-line credits, artists, counts and metadata" },
  { token: "--border", value: "oklch(1 0 0 / 10%)", name: "Etched Border", note: "Ten per cent translucent white for crisp hairline edges" },
];

const PRIMITIVES = [
  "alert-dialog", "badge", "button", "card", "input", "scroll-area",
  "select", "separator", "sheet", "skeleton", "slider", "toggle", "tooltip",
];

export default function DesignPage() {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl leading-tight">Design system</h1>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
          Sargam is an intentional aesthetic of Deep Obsidian Velvet and Radiant Luminous Amber.
          There is <Key>no light mode and no second brand colour</Key>, which is less a
          principle than an admission: a catalogue of golden-era Hindi film music
          belongs in the atmosphere of a vintage listening room bathed in warm amber glow.
        </p>
      </header>

      <Section
        title="Colour"
        lead={
          <>
            Colour is a CSS custom property in OKLCH almost everywhere, rather
            than a value written into a class string.{" "}
            <Key>OKLCH because its lightness is perceptual</Key> — the accent
            and the heart sit at 0.82 and 0.72, so they read as harmonious siblings rather
            than one shouting over the other.
          </>
        }
      >
        <ul className="space-y-2">
          {PALETTE.map((swatch) => (
            <li
              key={swatch.token}
              className="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-card/40 p-2.5"
            >
              <span
                aria-hidden
                className="size-9 shrink-0 rounded-md ring-1 ring-white/10"
                style={{ background: swatch.value }}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm">{swatch.name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {swatch.note}
                </span>
              </span>
              <code className="hidden shrink-0 font-mono text-[11px] text-muted-foreground sm:block">
                {swatch.token}
              </code>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Type"
        lead="Figtree, at one weight range, for everything. It was chosen for the company it keeps: the faces music apps favour are geometric sans, Spotify's own Circular is proprietary, and Figtree is the free one that sits nearest without imitating."
      >
        <div className="space-y-3 rounded-lg border border-white/[0.07] bg-card/40 p-4">
          <p className="text-3xl leading-tight">Aa Dil Se Dil Mila Le</p>
          <p className="text-lg leading-snug">Asha Bhosle · Navrang · 1959</p>
          <p className="text-sm text-muted-foreground">
            Body text sits at 14px with relaxed leading. Second-line detail is
            muted rather than smaller, so a song row stays two readable lines
            instead of one readable and one squinted at.
          </p>
        </div>
      </Section>

      <Section
        title="Breakpoints"
        lead={
          <>
            The one genuinely unusual thing here. Tailwind&apos;s breakpoints ask
            about width; <Key>ours ask about height too</Key>.
          </>
        }
      >
        <div className="overflow-x-auto rounded-lg border border-white/[0.07] bg-card/40">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-white/[0.07]">
                <th className="px-3 py-2 font-medium">Variant</th>
                <th className="px-3 py-2 font-medium">Applies when</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {[
                ["sm", "width ≥ 40rem and height ≥ 30rem"],
                ["md", "width ≥ 48rem and height ≥ 30rem"],
                ["lg", "width ≥ 64rem and height ≥ 30rem"],
              ].map(([name, rule]) => (
                <tr key={name} className="border-b border-white/[0.05] last:border-0">
                  <td className="px-3 py-2 text-foreground">{name}:</td>
                  <td className="px-3 py-2 text-muted-foreground">{rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
          A phone turned sideways is 844px wide and 390px tall. Judged on width
          alone it looks like a tablet, so the app used to rearrange itself into
          a layout meant for a much taller window. Width was standing in for
          &ldquo;what kind of device is this&rdquo;, and rotating a phone changes
          the width without changing the answer.
        </p>
      </Section>

      <Section
        title="Components"
        lead={
          <>
            shadcn/ui, but <Key>on Base UI rather than Radix</Key> — the part
            worth knowing if you are reading the source expecting{" "}
            <code className="font-mono text-xs">asChild</code> and finding
            render props instead.
          </>
        }
      >
        <div className="flex flex-wrap gap-1.5">
          {PRIMITIVES.map((name) => (
            <code
              key={name}
              className="rounded-md bg-white/[0.06] px-2 py-1 font-mono text-xs text-muted-foreground"
            >
              {name}
            </code>
          ))}
        </div>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
          Thirteen primitives, and everything else is composed in the app rather
          than installed. Lists are virtualised with react-virtuoso, because
          3,916 rows is more than a browser will draw happily. Icons are lucide,
          at one size per context.
        </p>
      </Section>

      <Section
        title="Idioms"
        lead="Four conventions the codebase keeps to. More useful to know than any single component, and easier to show than to describe."
      >
        <div className="space-y-4">
          <Panel className="p-4">
            <p className="text-sm">
              <Key>Edges fade rather than stop.</Key>
            </p>
            <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
              Artwork, overflowing titles and the backdrop all end in a mask
              gradient instead of a hard line.
            </p>
            <Code caption="components/player-bar.tsx — abridged. Underscores, not spaces: that is Tailwind v4's arbitrary-value syntax, and it will not compile with real ones.">
{`<span className="absolute inset-y-0 left-0 w-[4.75rem] overflow-hidden
  [mask-image:linear-gradient(to_right,#000_0%,transparent_88%)]
  [-webkit-mask-image:linear-gradient(to_right,#000_0%,transparent_88%)]
  md:hidden">
  <img src={artwork(song.video)} className="size-full object-cover" />
</span>`}
            </Code>
          </Panel>

          <Panel className="p-4">
            <p className="text-sm">
              <Key>Motion is opt-out everywhere.</Key>
            </p>
            <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
              Every backdrop ships a still beside its video, and the pair swap
              on the browser&apos;s own setting rather than on a preference we
              invented.
            </p>
            <Code caption="components/app-backdrop.tsx — one of these is always hidden">
{`<video className="… motion-reduce:hidden" poster={poster} />
<img   className="hidden … motion-reduce:block" src={poster} />`}
            </Code>
          </Panel>

          <Panel className="p-4">
            <p className="text-sm">
              <Key>Colour never carries meaning alone.</Key>
            </p>
            <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
              A toggle that shows its state in the accent also says so in the
              markup, so it survives a screen reader and a colour filter.
            </p>
            <Code caption="components/like-button.tsx — abridged. Note the render prop: that is the Base UI idiom, where Radix would take asChild.">
{`<TooltipTrigger render={
  <button
    aria-pressed={liked}
    aria-label={liked ? "Remove from favourites"
                      : "Add to favourites"} />
}>
  <Heart className={liked ? "fill-current" : ""} />
</TooltipTrigger>`}
            </Code>
          </Panel>

          <Panel className="p-4">
            <p className="text-sm">
              <Key>Tokens, never literals.</Key>
            </p>
            <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
              A hex in a class string is where a palette starts drifting. Even
              shadows quote the token&apos;s own value.
            </p>
            <Code caption="left: how the app writes colour. right: what it avoids.">
{`bg-primary/15  text-primary  border-heart/40
bg-[#f59e0b]   text-[#e11d48]`}
            </Code>
          </Panel>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  lead,
  children,
}: {
  title: string;
  lead: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg leading-snug">{title}</h2>
      <p className="mb-4 mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
        {lead}
      </p>
      {children}
    </section>
  );
}
