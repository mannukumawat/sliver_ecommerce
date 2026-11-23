# AURAVÉ — premium silver jewellery (frontend demo)

React 19 + Vite + React Router + React Three Fiber. Frontend only: no backend, payments or auth.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build && npm run preview
```

## Routes
`/` home · `/collection` (filters/sort in the URL: `?category=rings&price=u1500&style=Minimal&colour=Blue&new=1&sort=price-asc`) · `/product/:slug` · `/wishlist` · `/policy/:shipping|privacy|terms` (placeholders)

## Structure
```
src/app          App (router + providers), Layout
src/components   Header, Footer, ProductCard, ProductGrid, CategoryCard, FilterSidebar, MobileFilterDrawer,
                 CartDrawer, QuickViewModal, ProductDetail, Drawer (shared dialog), Button, …
src/pages        Home, Collection, Product, Wishlist, Policy, NotFound
src/three        HeroExperience (lazy, IntersectionObserver, fallback), JewelleryScene, PendantModel, FallbackHero
src/context      Cart, Wishlist (localStorage), UI
src/data         products (24), categories, filters
src/styles       tokens.css, global.css (component CSS is colocated)
docs/FIGMA_SPEC.md   design handoff
```

## Notes
- Product imagery: Unsplash photos stored in public/images (credits in docs/IMAGE_CREDITS.md); they are placeholders for a real photoshoot. ProductImage falls back to a tinted block if a file is missing.
- Home hero (src/hero) is a pinned cinematic scroll: GSAP ScrollTrigger timeline drives a procedural 3D necklace (reveal, rotation, exploded view, reassembly) and a draggable SVG circular controller. Scroll is the single source of truth; the dial only scrolls the page. Click the sapphire, pendant, bail or chain (hotspots in the exploded scene) for a camera focus + detail card (sample copy). Reduced-motion / no-WebGL users get the static `pages/home/Hero.jsx`.
- Trust-strip, testimonial and product-material copy is demo content and must be verified before launch.
