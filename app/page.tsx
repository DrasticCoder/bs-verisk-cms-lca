import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/product">
          <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Products</h3>
              <p className="mt-2 text-sm text-gray-500">
                Manage product information and settings
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
