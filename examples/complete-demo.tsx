import FFTWhite from "@/components/fft-white"

export default function CompleteDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <FFTWhite scaleFactor={0.25} enablePixelEffect={false} width="100px" height="35px" />
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              首页
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              服务
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              关于
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              联系
            </a>
          </div>
        </div>
      </nav>

      {/* 英雄区域 */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FFTWhite scaleFactor={1.5} enablePixelEffect={true} className="mb-8" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">FFT Investment</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            通过先进的数据分析和高性能分布式人工智能，我们致力于提供可持续和有韧性的投资回报。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              开始投资
            </button>
            <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              了解更多
            </button>
          </div>
        </div>
      </section>

      {/* 特性展示 */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">我们的优势</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "数据分析", color: "#3DB7EA", desc: "先进的数据分析技术" },
              { title: "人工智能", color: "#10B981", desc: "高性能分布式AI系统" },
              { title: "风险控制", color: "#F59E0B", desc: "全面的风险管理体系" },
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg border hover:shadow-lg transition-shadow">
                <FFTWhite
                  scaleFactor={0.4}
                  logoRightColor={feature.color}
                  matrixRightColor={feature.color}
                  enablePixelEffect={false}
                  className="mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <FFTWhite scaleFactor={0.5} logoLeftColor="#FFFFFF" logoRightColor="#60A5FA" enablePixelEffect={false} />
            <div className="flex gap-6 mt-4 md:mt-0">
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
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2024 FFT Investment. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
