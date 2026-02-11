import Navbar from '@/components/Navbar';

export default function DDAView() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">DDA View</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Drug Distribution Authority monitoring panel</p>
        </div>
      </main>
    </div>
  );
}
