# MedBot Quick Reference Card

## Import
```tsx
import MedBot from '@/components/MedBot';
```

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size of mascot |
| `animated` | `boolean` | `true` | Enable animations |
| `className` | `string` | `''` | Additional CSS classes |

## Sizes
- **sm**: 80px × 80px
- **md**: 120px × 120px ⭐ default
- **lg**: 160px × 160px
- **xl**: 200px × 200px

## Quick Examples

### Default
```tsx
<MedBot />
```

### Small, Static
```tsx
<MedBot size="sm" animated={false} />
```

### Large, Animated
```tsx
<MedBot size="lg" />
```

## Common Use Cases

### Chatbot Button
```tsx
<button onClick={openChat}>
  <MedBot size="sm" />
</button>
```

### Loading Indicator
```tsx
<div className="flex flex-col items-center gap-3">
  <MedBot size="md" />
  <p>Loading...</p>
</div>
```

### Success Message
```tsx
<div className="flex items-center gap-3">
  <MedBot size="sm" animated={false} />
  <span>Success!</span>
</div>
```

### Empty State
```tsx
<div className="text-center py-12">
  <MedBot size="lg" />
  <h3 className="mt-4">No results found</h3>
</div>
```

## Colors
- **Primary**: Cyan/Teal (#06b6d4, #0891b2, #0e7490)
- **Accent**: Emerald (#10b981) for heart
- **Highlights**: White (#ffffff) for cross

## Animations
1. Floating antenna
2. Pulsing antenna light
3. Glowing screen
4. Blinking interface dots
5. Heartbeat
6. Waving arms
7. Pulsing shadow

## Files
- Component: `frontend/src/components/MedBot.tsx`
- Styles: `frontend/src/components/MedBot.css`
- Showcase: `frontend/src/components/MedBotShowcase.tsx`
- Demo Page: `frontend/src/pages/MedBotDemo.tsx`

## View Demo
Add to `App.tsx` routes:
```tsx
<Route path="/medbot-demo" element={<MedBotDemo />} />
```
Then visit: `http://localhost:8080/medbot-demo`
