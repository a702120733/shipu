# FFT White Logo Component

一个可复用的FFT Logo组件，支持像素化效果和交互动画。

## 安装

### Next.js 项目
\`\`\`bash
npm install framer-motion @next/font
\`\`\`

### 其他React项目
\`\`\`bash
npm install framer-motion
\`\`\`

## 使用方法

### 基本使用
\`\`\`tsx
import FFTWhite from "./components/fft-white"

function App() {
  return (
    <div>
      <FFTWhite />
    </div>
  )
}
\`\`\`

### 自定义配置
\`\`\`tsx
<FFTWhite 
  scaleFactor={1.5}
  logoLeftColor="#000000"
  logoRightColor="#FF6B6B"
  enablePixelEffect={true}
  width="500px"
  height="400px"
/>
\`\`\`

## Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| scaleFactor | number | 1.0 | 缩放因子 |
| backgroundColor | string | "transparent" | 背景颜色 |
| logoLeftColor | string | "#3C4043" | 左侧文字颜色 |
| logoRightColor | string | "#3DB7EA" | 右侧圆点颜色 |
| enablePixelEffect | boolean | true | 是否启用像素效果 |
| width | string/number | "auto" | 容器宽度 |
| height | string/number | "auto" | 容器高度 |
| className | string | "" | 自定义CSS类 |

## 特性

- ✅ 响应式设计
- ✅ 像素化交互效果
- ✅ 矩阵动画效果
- ✅ 高度可定制
- ✅ TypeScript支持
- ✅ 零依赖（简化版本）
