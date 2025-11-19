import Twin from '@/components/twin'; // 如未設置 @ 別名，改相對路徑

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Hi there, I am Andrew!
          </h1>

          {/* 將原本固定 600px 改成視窗比例，並在上方加間距 */}
          <div className="mt-6 h-[80vh] md:h-[70vh]">
            <Twin />
          </div>
        </div>
      </div>
    </main>
  );
}
