import Navbar from '@/components/Navbar';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Combat Counterfeit Medicines
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Blockchain-powered pharmaceutical tracking and verification
          </p>
        </div>
      </main>
    </div>
  );
}
