import React from 'react';
import MedBot from './MedBot';

const MedBotShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4">MedBot Mascot</h1>
          <p className="text-lg text-slate-600 font-medium">
            Premium Healthcare AI Assistant for Sahi Aaushadi
          </p>
        </div>

        {/* Size Variations */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Size Variations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-end justify-items-center">
            <div className="text-center">
              <MedBot size="sm" />
              <p className="mt-3 text-sm font-semibold text-slate-600">Small (80px)</p>
            </div>
            <div className="text-center">
              <MedBot size="md" />
              <p className="mt-3 text-sm font-semibold text-slate-600">Medium (120px)</p>
            </div>
            <div className="text-center">
              <MedBot size="lg" />
              <p className="mt-3 text-sm font-semibold text-slate-600">Large (160px)</p>
            </div>
            <div className="text-center">
              <MedBot size="xl" />
              <p className="mt-3 text-sm font-semibold text-slate-600">Extra Large (200px)</p>
            </div>
          </div>
        </div>

        {/* Animation Toggle */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Animation States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
            <div className="text-center">
              <MedBot size="lg" animated={true} />
              <p className="mt-3 text-sm font-semibold text-slate-600">Animated (Default)</p>
            </div>
            <div className="text-center">
              <MedBot size="lg" animated={false} />
              <p className="mt-3 text-sm font-semibold text-slate-600">Static</p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Use Cases</h2>
          
          {/* Chatbot Header */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-700 mb-3">Chatbot Header</h3>
            <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl p-4 flex items-center gap-4">
              <MedBot size="sm" />
              <div>
                <h4 className="text-white font-bold text-lg">MedBot Assistant</h4>
                <p className="text-cyan-100 text-sm">How can I help you today?</p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-700 mb-3">Loading State</h3>
            <div className="bg-slate-50 rounded-xl p-6 flex flex-col items-center gap-3">
              <MedBot size="md" />
              <p className="text-slate-600 font-medium">Verifying medicine...</p>
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-700 mb-3">Success Message</h3>
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 flex items-start gap-4">
              <MedBot size="sm" animated={false} />
              <div>
                <h4 className="text-emerald-800 font-bold text-lg mb-1">Medicine Verified!</h4>
                <p className="text-emerald-700 text-sm">
                  This medicine is authentic and safe to use. All blockchain checks passed.
                </p>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-3">Help Section</h3>
            <div className="bg-white border-2 border-slate-200 rounded-xl p-6 flex items-start gap-4">
              <MedBot size="md" />
              <div>
                <h4 className="text-slate-900 font-bold text-lg mb-2">Need Help?</h4>
                <p className="text-slate-600 text-sm mb-3">
                  I'm here to assist you with medicine verification, finding pharmacies, and answering your health questions.
                </p>
                <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition">
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Modern 3D Design</h4>
                <p className="text-sm text-slate-600">Soft gradients and depth layers for premium look</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Glassmorphism Effects</h4>
                <p className="text-sm text-slate-600">Subtle lighting and micro reflections</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Healthcare Identity</h4>
                <p className="text-sm text-slate-600">Medical cross integrated tastefully</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Smooth Animations</h4>
                <p className="text-sm text-slate-600">Floating antenna, pulsing heart, waving arms</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Blue-Teal Palette</h4>
                <p className="text-sm text-slate-600">Matches green health-themed UI perfectly</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Production Ready</h4>
                <p className="text-sm text-slate-600">Scalable SVG, accessible, responsive</p>
              </div>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="bg-slate-900 rounded-2xl shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Usage Example</h2>
          <pre className="text-cyan-300 text-sm overflow-x-auto">
            <code>{`import MedBot from '@/components/MedBot';

// Basic usage
<MedBot />

// Custom size
<MedBot size="lg" />

// Without animation
<MedBot size="md" animated={false} />

// With custom className
<MedBot size="sm" className="my-custom-class" />`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default MedBotShowcase;
