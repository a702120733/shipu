"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AboutPage() {
  const router = useRouter()

  useEffect(() => {
    // 重定向到首页
    router.replace("/")
  }, [router])

  // 在重定向期间显示空白页面
  return null

  // /** rest of code here **/
  // return (
  //   <main className="min-h-screen bg-white text-[#3C4043]">
  //     <GridContainer>
  //       <Navbar showLogo={true} />

  //       <div className="pt-24 pb-16 px-12 w-full">
  //         <motion.div
  //           initial={{ opacity: 0, y: 30 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           transition={{ duration: 0.6 }}
  //           className="mb-16"
  //         >
  //
  //
  //         </motion.div>

  //         <motion.div
  //           initial={{ opacity: 0, y: 50 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           transition={{ duration: 0.8, delay: 0.2 }}
  //           className="mb-0"
  //         >
  //           <div className="flex items-center mb-12">
  //             <h2 className="text-6xl font-bold text-black">CoFounder</h2>
  //             <div className="w-4 h-4 bg-[#3DB7EA] rounded-full ml-3"></div>
  //           </div>

  //           <div className="bg-[#F3F3F3] rounded-2xl p-12">
  //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  //               <div className="space-y-8">
  //                 <ul className="space-y-6 text-lg">
  //                   <li className="flex items-start">
  //                     <div className="w-2 h-2 bg-black rounded-full mt-3 mr-4 flex-shrink-0"></div>
  //                     <span className="text-gray-800">Tsinghua Yao Class graduate</span>
  //                   </li>
  //                   <li className="flex items-start">
  //                     <div className="w-2 h-2 bg-black rounded-full mt-3 mr-4 flex-shrink-0"></div>
  //                     <span className="text-gray-800">
  //                       Gold medalist in the International Olympiad in Informatics (IOI)
  //                     </span>
  //                   </li>
  //                   <li className="flex items-start">
  //                     <div className="w-2 h-2 bg-black rounded-full mt-3 mr-4 flex-shrink-0"></div>
  //                     <span className="text-gray-800">
  //                       Former quantitative researcher and investment professional at a top global hedge fund
  //                     </span>
  //                   </li>
  //                 </ul>

  //                 <div className="flex space-x-4 pt-6">
  //                   <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm">
  //                     <Globe size={20} className="text-[#3C4043]" />
  //                   </button>
  //                   <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm">
  //                     <Instagram size={20} className="text-[#3C4043]" />
  //                   </button>
  //                 </div>
  //               </div>

  //               <div className="flex justify-center lg:justify-end">
  //                 <div className="relative">
  //                   <div className="absolute -right-4 -bottom-4 w-80 h-96 bg-[#3DB7EA] rounded-lg"></div>
  //                   <div className="relative w-80 h-96 bg-white rounded-lg overflow-hidden">
  //                     <Image src="/images/cofounder1.png" alt="CoFounder 1" fill className="object-cover" />
  //                   </div>
  //                   <div className="absolute -top-4 -left-4 grid grid-cols-3 gap-2">
  //                     {Array.from({ length: 9 }).map((_, i) => (
  //                       <div key={i} className="w-2 h-2 bg-black rounded-full"></div>
  //                     ))}
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </motion.div>

  //         <div className="w-full flex justify-center">
  //           <Image
  //             src="/images/curved-separator-new.png"
  //             alt="Decorative separator"
  //             width={1200}
  //             height={100}
  //             className="opacity-40 w-full h-auto"
  //           />
  //         </div>

  //         <motion.div
  //           initial={{ opacity: 0, y: 50 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           transition={{ duration: 0.8, delay: 0.4 }}
  //           className="mb-0"
  //         >
  //           <div className="flex items-center justify-end mb-12">
  //             <h2 className="text-6xl font-bold text-black">CoFounder</h2>
  //             <div className="w-4 h-4 bg-[#3DB7EA] rounded-full ml-3"></div>
  //           </div>

  //           <div className="bg-[#F3F3F3] rounded-2xl p-12">
  //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  //               <div className="flex justify-center lg:justify-start order-2 lg:order-1">
  //                 <div className="relative">
  //                   <div className="absolute -left-4 -bottom-4 w-80 h-96 bg-[#3DB7EA] rounded-lg"></div>
  //                   <div className="relative w-80 h-96 bg-white rounded-lg overflow-hidden">
  //                     <Image src="/images/cofounder2-new.png" alt="CoFounder 2" fill className="object-cover" />
  //                   </div>
  //                   <div className="absolute -top-4 -right-4 grid grid-cols-3 gap-2">
  //                     {Array.from({ length: 9 }).map((_, i) => (
  //                       <div key={i} className="w-2 h-2 bg-black rounded-full"></div>
  //                     ))}
  //                   </div>
  //                 </div>
  //               </div>

  //               <div className="space-y-8 order-1 lg:order-2">
  //                 <ul className="space-y-6 text-lg">
  //                   <li className="flex items-start">
  //                     <div className="w-2 h-2 bg-black rounded-full mt-3 mr-4 flex-shrink-0"></div>
  //                     <span className="text-gray-800">Recipient of Tsinghua University's Special Scholarship</span>
  //                   </li>
  //                   <li className="flex items-start">
  //                     <div className="w-2 h-2 bg-black rounded-full mt-3 mr-4 flex-shrink-0"></div>
  //                     <span className="text-gray-800">
  //                       Extensive management and engineering experience at leading global internet companies
  //                     </span>
  //                   </li>
  //                   <li className="flex items-start">
  //                     <div className="w-2 h-2 bg-black rounded-full mt-3 mr-4 flex-shrink-0"></div>
  //                     <span className="text-gray-800">Computer Science graduate from Tsinghua University</span>
  //                   </li>
  //                   <li className="flex items-start">
  //                     <div className="w-2 h-2 bg-black rounded-full mt-3 mr-4 flex-shrink-0"></div>
  //                     <span className="text-gray-800">Gold medalist in the National Olympiad in Informatics (NOI)</span>
  //                   </li>
  //                 </ul>

  //                 <div className="flex space-x-4 pt-6">
  //                   <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm">
  //                     <Globe size={20} className="text-[#3C4043]" />
  //                   </button>
  //                   <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm">
  //                     <Instagram size={20} className="text-[#3C4043]" />
  //                   </button>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </motion.div>
  //       </div>
  //     </GridContainer>
  //   </main>
  // )
}
