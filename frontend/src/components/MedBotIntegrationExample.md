# MedBot Integration Guide

## Overview
MedBot is a premium SVG-based healthcare AI mascot designed for the Sahi Aaushadi platform. It features modern 3D effects, glassmorphism, smooth animations, and a professional healthcare identity.

## Features
- ✅ Modern soft 3D design with depth layers
- ✅ Glassmorphism effects with subtle lighting
- ✅ Smooth gradient transitions (blue-teal palette)
- ✅ Animated elements (antenna, heart pulse, arm waves)
- ✅ Medical cross integrated tastefully
- ✅ Smart AI interface with glowing screen
- ✅ Production-ready and scalable (SVG)
- ✅ Fully accessible with reduced motion support
- ✅ Responsive and customizable

## Component API

### Props
```typescript
interface MedBotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';  // Default: 'md'
  animated?: boolean;                 // Default: true
  className?: string;                 // Additional CSS classes
}
```

### Size Reference
- `sm`: 80px × 80px
- `md`: 120px × 120px (default)
- `lg`: 160px × 160px
- `xl`: 200px × 200px

## Usage Examples

### Basic Usage
```tsx
import MedBot from '@/components/MedBot';

function MyComponent() {
  return <MedBot />;
}
```

### Custom Size
```tsx
<MedBot size="lg" />
```

### Without Animation
```tsx
<MedBot size="md" animated={false} />
```

### With Custom Styling
```tsx
<MedBot size="sm" className="my-4 mx-auto" />
```

## Integration Examples

### 1. Chatbot Header
```tsx
<div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl p-4 flex items-center gap-4">
  <MedBot size="sm" />
  <div>
    <h4 className="text-white font-bold">MedBot Assistant</h4>
    <p className="text-cyan-100 text-sm">How can I help you today?</p>
  </div>
</div>
```

### 2. Loading State
```tsx
<div className="flex flex-col items-center gap-3">
  <MedBot size="md" />
  <p className="text-slate-600 font-medium">Verifying medicine...</p>
</div>
```

### 3. Success Message
```tsx
<div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 flex items-start gap-4">
  <MedBot size="sm" animated={false} />
  <div>
    <h4 className="text-emerald-800 font-bold">Medicine Verified!</h4>
    <p className="text-emerald-700 text-sm">
      This medicine is authentic and safe to use.
    </p>
  </div>
</div>
```

### 4. Empty State
```tsx
<div className="text-center py-12">
  <MedBot size="lg" />
  <h3 className="text-xl font-bold text-slate-900 mt-4">No Results Found</h3>
  <p className="text-slate-600 mt-2">Try adjusting your search criteria</p>
</div>
```

### 5. Help Button
```tsx
<button className="fixed bottom-6 right-6 bg-white rounded-full p-4 shadow-2xl hover:scale-110 transition">
  <MedBot size="sm" animated={false} />
</button>
```

## Integrating with Existing Chatbot

### Option 1: Replace Icon in Chatbot Button
In `frontend/src/components/chatbot/MedicineChatBot.tsx`:

```tsx
import MedBot from '@/components/MedBot';

// Replace the current icon with:
<div id="chatbot-btn" onClick={toggleChat}>
  <MedBot size="sm" animated={false} />
</div>
```

### Option 2: Add to Chat Header
```tsx
<div id="chat-header">
  <div className="flex items-center gap-2">
    <MedBot size="sm" />
    <span>MedBot Assistant</span>
  </div>
  <span id="close-btn" onClick={closeChat}>✖</span>
</div>
```

### Option 3: Welcome Message
```tsx
{messages.length === 0 && (
  <div className="flex flex-col items-center gap-3 p-6">
    <MedBot size="md" />
    <p className="text-center text-slate-600">
      Hi! I'm MedBot. How can I help you verify medicines today?
    </p>
  </div>
)}
```

## Animation Details

### Animated Elements
1. **Antenna**: Gentle floating motion with slight rotation
2. **Antenna Light**: Pulsing glow effect (green)
3. **Screen**: Subtle glow pulsation
4. **Interface Dots**: Sequential blinking pattern
5. **Heart**: Realistic heartbeat animation
6. **Arms**: Alternating wave motion
7. **Shadow**: Synchronized pulse with body

### Accessibility
- Respects `prefers-reduced-motion` setting
- All animations disabled for users who prefer reduced motion
- Proper ARIA attributes can be added as needed

## Color Palette

### Primary Colors
- Cyan 500: `#06b6d4`
- Cyan 400: `#22d3ee`
- Cyan 300: `#67e8f9`
- Teal 600: `#0891b2`
- Teal 700: `#0e7490`

### Accent Colors
- Emerald 500: `#10b981` (heart/health indicator)
- White: `#ffffff` (highlights and medical cross)

### Gradients
- Body: Cyan 500 → Teal 600 → Teal 700
- Head: Cyan 400 → Cyan 500
- Screen: Cyan 300 → Cyan 400 → Cyan 500
- Glow: White → Cyan 300

## Performance Considerations

1. **SVG Optimization**: All paths are optimized for minimal file size
2. **CSS Animations**: Hardware-accelerated transforms
3. **Lazy Loading**: Component can be code-split if needed
4. **No External Dependencies**: Pure React + CSS

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Changing Colors
Edit the gradient definitions in `MedBot.tsx`:
```tsx
<linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
  <stop offset="0%" stopColor="#YOUR_COLOR" />
  {/* ... */}
</linearGradient>
```

### Adjusting Animations
Modify animation timing in `MedBot.css`:
```css
.medbot-animated .medbot-antenna {
  animation: antennaFloat 3s ease-in-out infinite;
  /* Change duration, timing function, etc. */
}
```

### Adding New Features
The SVG structure is modular - you can add new elements by:
1. Adding new `<g>` groups in the SVG
2. Creating corresponding CSS animations
3. Adding to the animated class conditions

## Testing

### Visual Testing
Access the showcase page at `/medbot-showcase` to see:
- All size variations
- Animation states
- Use case examples
- Integration patterns

### Accessibility Testing
- Test with screen readers
- Verify keyboard navigation
- Check reduced motion preferences
- Validate color contrast ratios

## Support

For questions or issues:
1. Check the showcase page for examples
2. Review this integration guide
3. Inspect the component source code
4. Test in different browsers and devices

## Version History

- v1.0.0 (2026-02-13): Initial release
  - Modern 3D design
  - Full animation suite
  - Production-ready implementation
  - Comprehensive documentation
