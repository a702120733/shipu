import FFTWhite from "@/components/fft-white"

export default function ResponsiveUsage() {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">响应式使用示例</h2>

      {/* 1. 响应式缩放 */}
      <section className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">响应式缩放</h3>
        <div className="bg-gray-50 rounded p-4">
          <FFTWhite
            scaleFactor={1}
            className="scale-50 sm:scale-75 md:scale-100 lg:scale-125"
            enablePixelEffect={true}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">在不同屏幕尺寸下自动调整大小：手机50%，平板75%，桌面100%，大屏125%</p>
      </section>

      {/* 2. 移动端优化 */}
      <section className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">移动端优化</h3>
        <div className="bg-gray-50 rounded p-4">
          <FFTWhite
            scaleFactor={0.8}
            enablePixelEffect={false} // 移动端禁用像素效果以提升性能
            className="md:hidden" // 只在移动端显示
          />
          <FFTWhite
            scaleFactor={1.2}
            enablePixelEffect={true}
            className="hidden md:block" // 只在桌面端显示
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">移动端使用较小尺寸且禁用像素效果，桌面端使用完整功能</p>
      </section>

      {/* 3. 容器适配 */}
      <section className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">容器适配</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 rounded p-4 flex items-center justify-center min-h-[200px]">
              <FFTWhite
                scaleFactor={0.6}
                enablePixelEffect={false}
                width="100%"
                height="auto"
                className="max-w-[200px]"
              />
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">Logo自动适配不同大小的容器</p>
      </section>
    </div>
  )
}
