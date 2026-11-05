/**
 * Tailwind is used only by the redesigned panels: user (src/user-app) and admin (src/admin-app/{layout,ui,features}).
 * - `prefix: 'tw-'` keeps utilities from clashing with Bootstrap classes used by admin/agent.
 * - `preflight: false` so Tailwind's reset does not restyle the existing admin pages.
 * - `important: '#ua-root'` lets utilities win over the legacy global CSS (public/css/*.css).
 * - rem values are converted to px because the legacy responsive.css sets html { font-size: 12px }
 *   on mobile, which would shrink every rem-based utility.
 */
const defaultTheme = require('tailwindcss/defaultTheme')

const remToPx = (value) =>
  typeof value === 'string' ? value.replace(/(-?[\d.]+)rem/g, (_, n) => `${parseFloat(n) * 16}px`) : value

const pxScale = (scale) =>
  Object.fromEntries(
    Object.entries(scale).map(([key, value]) => [
      key,
      Array.isArray(value)
        ? [remToPx(value[0]), Object.fromEntries(Object.entries(value[1] || {}).map(([k, v]) => [k, remToPx(v)]))]
        : remToPx(value),
    ]),
  )

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/user-app/**/*.{ts,tsx}', './src/admin-app/{layout,ui,features}/**/*.{ts,tsx}', './src/shared/**/*.{ts,tsx}'],
  prefix: 'tw-',
  important: '#ua-root',
  corePlugins: { preflight: false },
  theme: {
    spacing: pxScale(defaultTheme.spacing),
    fontSize: pxScale(defaultTheme.fontSize),
    lineHeight: pxScale(defaultTheme.lineHeight),
    borderRadius: pxScale(defaultTheme.borderRadius),
    maxWidth: ({ theme, breakpoints }) => pxScale(defaultTheme.maxWidth({ theme, breakpoints })),
    extend: {
      colors: {
        primary: 'var(--ua-primary)',
        'primary-two': 'var(--ua-primary-two)',
        secondary: 'var(--ua-secondary)',
        page: 'var(--ua-page)',
        fg: 'var(--ua-foreground)',
        'muted-fg': 'var(--ua-muted-fg)',
        back: { DEFAULT: 'var(--ua-back)', strong: 'var(--ua-back-strong)', fg: 'var(--ua-back-fg)', hover: 'var(--ua-back-hover)' },
        lay: { DEFAULT: 'var(--ua-lay)', strong: 'var(--ua-lay-strong)', fg: 'var(--ua-lay-fg)', hover: 'var(--ua-lay-hover)' },
        success: { DEFAULT: 'var(--ua-success)', soft: 'var(--ua-success-soft)' },
        warning: 'var(--ua-warning)',
        suspended: { DEFAULT: 'var(--ua-suspended)', fg: 'var(--ua-suspended-fg)' },
        link: 'var(--ua-link)',
        rules: 'var(--ua-rules)',
        'row-active': 'var(--ua-row-active)',
        menu: 'var(--ua-menu-active)',
        line: 'var(--ua-border)',
        'table-head': { DEFAULT: 'var(--ua-table-head)', fg: 'var(--ua-table-head-fg)' },
        muted: 'var(--ua-muted)',
        // admin panel (v1 admin spec §2)
        ad: {
          bg: 'var(--ad-bg)',
          card: 'var(--ad-card)',
          side: 'var(--ad-side)',
          item: 'var(--ad-item)',
          modal: 'var(--ad-modal)',
          muted: 'var(--ad-muted)',
          success: 'var(--ad-success)',
          danger: 'var(--ad-danger)',
          info: 'var(--ad-info)',
          warning: 'var(--ad-warning)',
          dark: 'var(--ad-dark)',
          light: 'var(--ad-light)',
          pill: 'var(--ad-pill)',
        },
      },
      // v2 type scale (§2.1) — pages use only these names
      fontSize: {
        badge: ['10px', { lineHeight: '12px', fontWeight: '700' }],
        meta: ['12px', { lineHeight: '16px' }],
        body: ['14px', { lineHeight: '20px' }],
        strong: ['14px', { lineHeight: '20px', fontWeight: '700' }],
        price: ['15px', { lineHeight: '18px', fontWeight: '700' }],
        section: ['16px', { lineHeight: '22px', fontWeight: '700' }],
        header: ['18px', { lineHeight: '24px', fontWeight: '700' }],
        title: ['22px', { lineHeight: '28px', fontWeight: '700' }],
        score: ['30px', { lineHeight: '34px', fontWeight: '900' }],
      },
      fontFamily: {
        lato: ['Lato', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        ua: '8px',
      },
      keyframes: {
        'ua-flash': { '0%': { backgroundColor: 'var(--ua-flash)' }, '100%': {} },
        'ua-shimmer': { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'ua-flash': 'ua-flash 400ms ease-out',
        'ua-shimmer': 'ua-shimmer 1.4s infinite',
      },
    },
  },
  plugins: [],
}
