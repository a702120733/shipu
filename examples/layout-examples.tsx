import FFTWhite from "@/components/fft-white"

export default function LayoutExamples() {
  return (
    <div className="space-y-12 p-8">
      {/* 1. 页面头部Logo */}
      <section>
        <h3 className="text-xl font-semibold mb-4">页面头部Logo</h3>
        <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
          <FFTWhite scaleFactor={0.3} enablePixelEffect={false} width="120px" height="40px" />
          <nav className="flex gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              首页
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              关于
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              联系
            </a>
          </nav>
        </header>
      </section>

      {/* 2. 英雄区域 */}
      <section>
        <h3 className="text-xl font-semibold mb-4">英雄区域</h3>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-12 text-center">
          <FFTWhite scaleFactor={1.5} enablePixelEffect={true} className="mb-8" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">欢迎来到 FFT Investment</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            通过先进的数据分析和高性能分布式人工智能，我们致力于提供可持续和有韧性的回报。
          </p>
        </div>
      </section>

      {/* 3. 卡片中的Logo */}
      <section>
        <h3 className="text-xl font-semibold mb-4">卡片中的Logo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "服务", color: "#3DB7EA" },
            { title: "关于", color: "#10B981" },
            { title: "联系", color: "#F59E0B" },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
              <FFTWhite
                scaleFactor={0.4}
                logoRightColor={item.color}
                matrixRightColor={item.color}
                enablePixelEffect={false}
                className="mb-4"
              />
              <h4 className="text-lg font-semibold">{item.title}</h4>
              <p className="text-gray-600 mt-2">这里是{item.title}相关的描述内容。</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 侧边栏Logo */}
      <section>
        <h3 className="text-xl font-semibold mb-4">侧边栏布局</h3>
        <div className="flex bg-gray-100 rounded-lg overflow-hidden min-h-[300px]">
          {/* 侧边栏 */}
          <div className="w-64 bg-white shadow-sm p-6">
            <FFTWhite scaleFactor={0.4} enablePixelEffect={false} className="mb-8" />
            <nav className="space-y-3">
              <a href="#" className="block text-gray-700 hover:text-blue-600">
                仪表板
              </a>
              <a href="#" className="block text-gray-700 hover:text-blue-600">
                投资组合
              </a>
              <a href="#" className="block text-gray-700 hover:text-blue-600">
                分析
              </a>
              <a href="#" className="block text-gray-700 hover:text-blue-600">
                设置
              </a>
            </nav>
          </div>

          {/* 主内容区 */}
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold mb-4">主要内容区域</h2>
            <p className="text-gray-600">这里是主要的内容区域，Logo显示在左侧边栏中。</p>
          </div>
        </div>
      </section>

      {/* 5. 页脚Logo */}
      <section>
        <h3 className="text-xl font-semibold mb-4">页脚Logo</h3>
        <footer className="bg-gray-900 text-white rounded-lg p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <FFTWhite
                scaleFactor={0.5}
                logoLeftColor="#FFFFFF"
                logoRightColor="#60A5FA"
                enablePixelEffect={false}
                className="mb-2"
              />
              <p className="text-gray-400 text-sm">© 2024 FFT Investment. 保留所有权利。</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white">
                隐私政策
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                服务条款
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                联系我们
              </a>
            </div>
          </div>
        </footer>
      </section>
    </div>
  )
}
