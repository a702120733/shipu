// 实现简化版的Perlin噪声函数，用于生成自然的波形扰动

// 生成一个伪随机值映射表
function generatePermutationTable() {
  const p = new Array(256)
  for (let i = 0; i < 256; i++) {
    p[i] = Math.floor(Math.random() * 256)
  }
  // 将数组复制一次，得到512长度的数组，用于处理边界情况
  return p.concat(p)
}

// 初始化置换表
const perm = generatePermutationTable()

// 平滑插值函数
function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

// 线性插值函数
function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a)
}

// 梯度函数
function grad(hash: number, x: number, y: number): number {
  const h = hash & 15
  const grad = 1 + (h & 7) // 1, 2, ..., 8
  const gradX = h < 8 ? grad : -grad // 反转一半梯度
  const gradY = h < 4 ? grad : -grad // 反转一部分梯度
  return (h & 1 ? gradX : 0) * x + (h & 2 ? gradY : 0) * y
}

// 2D Perlin噪声函数
export function perlin2D(x: number, y: number): number {
  // 找到坐标的整数部分
  const X = Math.floor(x) & 255
  const Y = Math.floor(y) & 255

  // 计算坐标的小数部分
  x -= Math.floor(x)
  y -= Math.floor(y)

  // 计算淡入淡出曲线
  const u = fade(x)
  const v = fade(y)

  // 计算hash值
  const A = perm[X] + Y
  const B = perm[X + 1] + Y

  // 在各个格点上计算梯度，并进行插值
  return (
    lerp(
      lerp(grad(perm[A], x, y), grad(perm[B], x - 1, y), u),
      lerp(grad(perm[A + 1], x, y - 1), grad(perm[B + 1], x - 1, y - 1), u),
      v,
    ) *
      0.5 +
    0.5
  ) // 将范围从[-1,1]转换为[0,1]
}
