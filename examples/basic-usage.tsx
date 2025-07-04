import FFTWhite from "@/components/fft-white"

export default function BasicUsage() {
  return (
    <div className="space-y-8 p-8">
      {/* 1. 默认配置 */}
      <div className="border p-4 rounded">
        <h3 className="mb-4 text-lg font-semibold">默认配置</h3>
        <FFTWhite />
      </div>

      {/* 2. 自定义尺寸 */}
      <div className="border p-4 rounded">
        <h3 className="mb-4 text-lg font-semibold">自定义尺寸</h3>
        <FFTWhite scaleFactor={0.5} width="300px" height="200px" />
      </div>

      {/* 3. 自定义颜色 */}
      <div className="border p-4 rounded bg-gray-900">
        <h3 className="mb-4 text-lg font-semibold text-white">深色主题</h3>
        <FFTWhite
          logoLeftColor="#FFFFFF"
          logoRightColor="#10B981"
          matrixLeftColor="#FFFFFF"
          matrixRightColor="#10B981"
          backgroundColor="transparent"
        />
      </div>

      {/* 4. 禁用像素效果 */}
      <div className="border p-4 rounded">
        <h3 className="mb-4 text-lg font-semibold">静态版本（无像素效果）</h3>
        <FFTWhite enablePixelEffect={false} scaleFactor={0.8} />
      </div>
    </div>
  )
}
