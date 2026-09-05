---
name: Sacred Union
colors:
  surface: '#fbf9f8'
  surface-dim: '#ded8e0'
  surface-bright: '#fdf7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f2fa'
  surface-container: '#f2ecf4'
  surface-container-high: '#ece6ee'
  surface-container-highest: '#e6e0e9'
  on-surface: '#1b1c1c'
  on-surface-variant: '#494551'
  inverse-surface: '#322f35'
  inverse-on-surface: '#f5eff7'
  outline: '#7a7582'
  outline-variant: '#cbc4d2'
  surface-tint: '#6750a4'
  primary: '#4f378a'
  on-primary: '#ffffff'
  primary-container: '#6750a4'
  on-primary-container: '#e0d2ff'
  inverse-primary: '#cfbcff'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#765b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c9a74d'
  on-tertiary-container: '#503d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbcff'
  on-primary-fixed: '#22005d'
  on-primary-fixed-variant: '#4f378a'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffdf93'
  tertiary-fixed-dim: '#e7c365'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#fdf7ff'
  on-background: '#1d1b20'
  surface-variant: '#e6e0e9'
  ethereal-lavender: '#F3EFFF'
  warm-ivory: '#FBF9F8'
  champagne-gold: '#D4AF37'
typography:
  display-lg:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 44px
  headline-sm:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  margin-desktop: 80px
  margin-mobile: 20px
  gutter: 24px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
  section-padding: 120px
---

## Brand & Style

The design system is centered on the intersection of modern sophistication and spiritual reverence. It evokes a sense of "Blessing" (축복) through an aesthetic that is both timeless and ethereal. The target audience seeks a marriage foundation built on shared values and spiritual growth, requiring an interface that feels like a digital sanctuary.

The design style is **Minimalist-Classical**. It utilizes intentional whitespace and refined editorial structures to create a "sacred" atmosphere. The aesthetic is light and airy, avoiding heavy decorative elements to emphasize the purity and significance of the commitment being celebrated. The combination of a deep purple primary and a champagne secondary introduces a layer of regal wisdom and sophisticated elegance.

## Colors

The color palette is curated to feel prestigious, nurturing, and spiritually significant.

*   **Primary (Spiritual Purple):** A deep, sophisticated violet (#6750a4) used for key brand moments and primary actions. It represents wisdom, devotion, and the sacred nature of the union.
*   **Secondary (Champagne Gold):** A muted gold (#D4AF37) used for secondary actions, accents, and decorative flourishes. It provides a warm, sophisticated contrast that symbolizes the enduring value and elegance of marriage.
*   **Neutral (Warm Ivory):** The foundation of the UI (#FBF9F8). This off-white reduces visual fatigue and provides an organic, parchment-like quality to the interface.
*   **Backgrounds:** Use Ethereal Lavender as a soft wash for supportive sections or background differentiation to maintain a harmonious tonal range.

## Typography

This system employs a pairing of **Noto Serif** for emotional storytelling and **Plus Jakarta Sans** for functional clarity.

*   **Headlines:** Noto Serif conveys tradition and authority. It should be used for all "Blessing" quotes and primary section headers. Maintain generous line heights to ensure a graceful vertical rhythm.
*   **Body:** Plus Jakarta Sans offers a friendly, modern contrast. Its open counters are ideal for long-form counseling content and testimonials.
*   **Styling:** Key labels and metadata should use `label-sm` with slight letter spacing for a refined editorial feel. Use `display-lg` for high-impact emotional hooks and hero messages.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop (12 columns, 1200px max) to convey a sense of organization and reliability.

*   **Whitespace:** Large section padding (120px) is mandatory to create "breathing room," reinforcing the sense of calm.
*   **Alignment:** Center-alignment should be used for pivotal emotional messages and step-based roadmaps to create a balanced focal point.
*   **Adaptivity:** On mobile, margins collapse to 20px. Use `stack-md` (24px) for vertical separation between components to prevent a cluttered appearance.

## Elevation & Depth

To maintain the airy and pure aesthetic, the design system avoids heavy, dark shadows in favor of tonal depth.

*   **Tonal Layering:** Hierarchy is achieved through subtle color shifts between the Warm Ivory background and pure white container surfaces.
*   **Ambient Glow:** For high-priority cards, use an extremely diffused, large-radius shadow tinted with the Primary Purple color at very low opacity (e.g., `rgba(103, 80, 164, 0.05)`).
*   **Soft Outlines:** Define boundaries using 1px borders in a muted purple or soft grey, keeping the interface feeling lightweight and ethereal.

## Shapes

The shape language is **Soft (0.25rem)**, providing enough structure to feel formal and traditional while avoiding the harshness of sharp corners.

*   **Structural Elements:** Buttons, input fields, and cards utilize a consistent 4px (Soft) radius.
*   **Arched Frames:** Hero imagery and featured photography may use arched top borders (semi-circle tops) to evoke the architectural feeling of a sanctuary or sacred space.
*   **Iconography:** Use thin-stroke, monolinear icons with rounded terminals to harmonize with the Plus Jakarta Sans typeface.

## Components

### Buttons
*   **Primary:** Solid Spiritual Purple background with white text. On hover, the background shifts to a deeper shade of violet.
*   **Secondary:** Solid Champagne Gold background with white or deep charcoal text. This is reserved for secondary calls to action and accents that require distinction from the primary brand color.
*   **Tertiary:** Ghost style with a Primary Purple border and text for auxiliary actions.

### Cards & Surfaces
*   Containers use a white background with a 1px soft grey border.
*   Padding is generous (24px to 32px) to maintain the minimalist-classical aesthetic.

### Sacred Roadmap (축복 절차)
*   A vertical or horizontal line in Champagne Gold or Primary Purple connecting numbered nodes.
*   Active steps feature a soft purple outer glow to signify progress.

### Testimonials
*   Large Noto Serif quotation marks in 10% opacity Purple.
*   Centrally aligned text with circular avatars; backgrounds should utilize the Ethereal Lavender wash.

### Input Fields
*   Top-aligned labels in `label-sm`.
*   Fields use the Warm Ivory background, transitioning to a white background with a 1px Primary Purple or Champagne Gold border on focus.