"use client"

import React from "react"

import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin, Clock, Users, X } from "lucide-react"
import Navbar from "@/components/navbar"
import GridContainer from "@/components/grid-container"
import { useState } from "react"

export default function JoinUsPage() {
  const [selectedPosition, setSelectedPosition] = useState<(typeof positions)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 打开弹窗
  const openModal = (position: (typeof positions)[0]) => {
    setSelectedPosition(position)
    setIsModalOpen(true)
    document.body.style.overflow = "hidden" // 防止背景滚动
  }

  // 关闭弹窗
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPosition(null)
    document.body.style.overflow = "" // 恢复滚动
  }

  // 组件卸载时恢复滚动
  React.useEffect(() => {
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  // Animation variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  // Benefits data - Updated to use new benefit images with detailed descriptions
  const benefits = [
    {
      image: "/images/benefits/bene01.png",
      title: "Competitive Compensation",
      description:
        "We offer industry-leading salary packages complemented by a transparent and fair performance evaluation system. Our compensation structure includes base salary, performance bonuses, and equity participation to ensure our team members are rewarded for their contributions.",
    },
    {
      image: "/images/benefits/bene02.png",
      title: "Growth Opportunities",
      description:
        "Continuous learning and career advancement programs designed to help you reach your full potential. We provide mentorship, training resources, conference attendance, and clear career progression paths within our organization.",
    },
    {
      image: "/images/benefits/bene03.png",
      title: "Generous Leave Policy",
      description:
        "Comprehensive vacation and personal time off policies that promote work-life balance. We understand the importance of rest and personal time, offering flexible PTO, sabbatical opportunities, and family leave options.",
    },
    {
      image: "/images/benefits/bene05.png",
      title: "Office Amenities",
      description:
        "State-of-the-art equipment and modern workspace designed for productivity and comfort. Our offices feature the latest technology, ergonomic furniture, recreational areas, and premium coffee to create an inspiring work environment.",
    },
    {
      image: "/images/benefits/bene04.png",
      title: "Annual Global Retreats",
      description:
        "Team building experiences around the world that strengthen our collaborative culture. These retreats combine strategic planning, skill development, and cultural exploration to foster innovation and team cohesion.",
    },
    {
      image: "/images/benefits/bene06.png",
      title: "Comprehensive Healthcare",
      description:
        "Full medical, dental, and wellness coverage for you and your family. Our healthcare package includes premium insurance plans, mental health support, fitness memberships, and preventive care programs.",
    },
  ]

  // Job positions data - 更新为包含详细信息
  const positions = [
    {
      title: "Quantitative Researcher",
      location: "Shanghai",
      type: "Full-time",
      description:
        "Join our quantitative research team to develop cutting-edge trading strategies using advanced mathematical models and machine learning techniques.",
      summary: "Develop trading strategies using advanced mathematical models and ML techniques.",
      requirements: [
        "PhD in Mathematics, Physics, Computer Science, Statistics, or related quantitative field",
        "Strong background in statistical modeling, time series analysis, and machine learning",
        "Proficiency in Python, R, C++, or similar programming languages",
        "Experience with financial markets, derivatives, and trading strategies",
        "Knowledge of portfolio optimization and risk management techniques",
        "Strong analytical and problem-solving skills",
        "Excellent communication skills and ability to work in a collaborative environment",
      ],
      responsibilities: [
        "Research and develop quantitative trading strategies across multiple asset classes",
        "Build and maintain statistical models for market prediction and risk assessment",
        "Analyze large datasets to identify market patterns and opportunities",
        "Collaborate with technology team to implement trading algorithms",
        "Monitor and optimize existing strategies for performance improvement",
        "Present research findings to senior management and investment committee",
      ],
      qualifications: [
        "3+ years of experience in quantitative finance or related field",
        "Track record of developing successful trading strategies",
        "Experience with high-frequency trading systems is a plus",
        "Knowledge of regulatory requirements in financial markets",
        "Strong mathematical foundation in probability, statistics, and optimization",
      ],
      available: true,
    },
    {
      title: "Software Engineer",
      location: "Shanghai",
      type: "Full-time",
      description: "Build and maintain high-performance trading systems and infrastructure.",
      summary: "Build high-performance trading systems and infrastructure.",
      requirements: [
        "Bachelor's or Master's degree in Computer Science or related field",
        "5+ years of experience in software development",
        "Proficiency in C++, Python, Java, or Go",
        "Experience with distributed systems and low-latency applications",
      ],
      responsibilities: [
        "Design and implement trading system architecture",
        "Optimize system performance for low-latency trading",
        "Develop APIs and integration solutions",
        "Maintain system reliability and monitoring",
      ],
      qualifications: [
        "Experience with financial trading systems",
        "Knowledge of network programming and protocols",
        "Familiarity with cloud platforms (AWS, GCP, Azure)",
        "Strong debugging and troubleshooting skills",
      ],
      available: false,
    },
    {
      title: "Data Scientist",
      location: "Shanghai",
      type: "Full-time",
      description: "Analyze complex financial datasets to drive investment decisions and strategy development.",
      summary: "Analyze complex datasets to drive investment decisions.",
      requirements: [
        "Master's or PhD in Data Science, Statistics, or related field",
        "3+ years of experience in data science or analytics",
        "Expertise in Python, R, SQL, and data visualization tools",
        "Experience with machine learning and statistical modeling",
      ],
      responsibilities: [
        "Develop predictive models for market analysis",
        "Create data pipelines and ETL processes",
        "Generate insights from alternative data sources",
        "Build dashboards and reporting tools",
      ],
      qualifications: [
        "Experience with big data technologies (Spark, Hadoop)",
        "Knowledge of financial markets and instruments",
        "Strong presentation and communication skills",
        "Experience with cloud-based analytics platforms",
      ],
      available: false,
    },
    {
      title: "Risk Manager",
      location: "Shanghai",
      type: "Full-time",
      description: "Develop and implement comprehensive risk management frameworks and controls.",
      summary: "Develop risk management frameworks and controls.",
      requirements: [
        "Master's degree in Finance, Economics, or related field",
        "5+ years of experience in risk management",
        "Strong knowledge of derivatives and portfolio theory",
        "Experience with risk modeling and stress testing",
      ],
      responsibilities: [
        "Monitor portfolio risk exposure and limits",
        "Develop risk measurement methodologies",
        "Conduct stress testing and scenario analysis",
        "Prepare risk reports for management",
      ],
      qualifications: [
        "Professional certifications (FRM, CFA) preferred",
        "Experience with regulatory compliance",
        "Knowledge of market risk, credit risk, and operational risk",
        "Strong analytical and quantitative skills",
      ],
      available: false,
    },
  ]

  return (
    <main className="min-h-screen bg-white text-[#3C4043]">
      <Navbar showLogo={true} />

      {/* Why Choose Us Section - Full Screen */}
      <section className="h-screen flex items-center justify-center relative">
        {/* Background Image - 添加背景图 */}
        <div
          className="absolute top-0 right-0 opacity-100 pointer-events-none z-0"
          style={{
            backgroundImage: "url(/images/gradient-background.png)",
            backgroundSize: "contain",
            backgroundPosition: "top right",
            backgroundRepeat: "no-repeat",
            width: "60vw",
            height: "100vh",
          }}
        />

        <GridContainer>
          <div className="px-12 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.h1
                variants={fadeInVariants}
                className="text-8xl font-bold mb-32"
                style={{ fontFamily: "var(--font-poppins), sans-serif" }}
              >
                <span className="text-[#3DB7EA]">Why</span> <span className="text-[#3C4043]">Choose Us</span>
                <span className="text-[#3DB7EA]">.</span>
              </motion.h1>

              <motion.p
                variants={fadeInVariants}
                className="text-xl text-[#3C4043] leading-relaxed max-w-3xl mx-auto"
                style={{ fontFamily: "var(--font-poppins), sans-serif" }}
              >
                At FFT Investment, we prioritize our employees' well-being and professional growth. Our comprehensive
                benefits package is designed to support a fulfilling and balanced work experience.
              </motion.p>
            </motion.div>
          </div>
        </GridContainer>
      </section>

      {/* Open Positions Section - Full Screen */}
      <section className="h-screen flex items-center justify-center bg-gray-50">
        <GridContainer>
          <div className="px-12 w-full">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.h2
                variants={fadeInVariants}
                className="text-8xl font-bold text-center mb-32"
                style={{ fontFamily: "var(--font-poppins), sans-serif" }}
              >
                <span className="text-[#3DB7EA]">Open</span> <span className="text-[#3C4043]">Positions</span>
                <span className="text-[#3DB7EA]">.</span>
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {positions.map((position, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInVariants}
                    className={`bg-white rounded-lg p-6 h-80 flex flex-col cursor-pointer transition-all duration-300 ${
                      position.available ? "hover:bg-gray-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => position.available && openModal(position)}
                  >
                    {position.available ? (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-8 h-8 bg-[#3DB7EA] rounded-full flex items-center justify-center">
                            <Users size={16} className="text-white" />
                          </div>
                          <span className="text-xs text-[#3DB7EA] font-medium">OPEN</span>
                        </div>

                        <h3 className="text-lg font-semibold text-[#3C4043] mb-2">{position.title}</h3>

                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <MapPin size={14} className="mr-1" />
                          <span>{position.location}</span>
                          <span className="mx-2">•</span>
                          <Clock size={14} className="mr-1" />
                          <span>{position.type}</span>
                        </div>

                        <p className="text-sm text-gray-700 mb-4 flex-grow">{position.summary}</p>

                        <div className="text-xs text-[#3DB7EA] font-medium">Click to view details →</div>
                      </>
                    ) : (
                      <div className="text-center py-8 flex flex-col items-center justify-center h-full">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Clock size={20} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#3C4043] mb-2">{position.title}</h3>
                        <p className="text-gray-500 text-sm">open soon</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </GridContainer>
      </section>

      {/* Life at FFT Section - Full Screen */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image src="/images/team-collaboration.png" alt="Team collaboration" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10">
          <GridContainer>
            <div className="px-12">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="text-center max-w-4xl mx-auto text-white"
              >
                <motion.h2
                  variants={fadeInVariants}
                  className="text-8xl font-bold mb-32"
                  style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                >
                  Life at FFT
                </motion.h2>

                <motion.p
                  variants={fadeInVariants}
                  className="text-xl leading-relaxed max-w-3xl mx-auto"
                  style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                >
                  At FFT Investment, we believe in maintaining a fun and creative work environment while delivering
                  exceptional results. Our team's collaborative spirit and unique approach to problem-solving sets us
                  apart in the investment industry.
                </motion.p>
              </motion.div>
            </div>
          </GridContainer>
        </div>
      </section>

      {/* Benefits Section - Full Screen with Carousel Cards - 灰色背景 */}
      <section className="h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-50">
        {/* 标题部分使用GridContainer */}
        <GridContainer>
          <div className="px-12 w-full">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.h2
                variants={fadeInVariants}
                className="text-8xl font-bold text-center mb-32"
                style={{ fontFamily: "var(--font-poppins), sans-serif" }}
              >
                <span className="text-[#3C4043]">Benefits</span>
                <span className="text-[#3DB7EA]">.</span>
              </motion.h2>
            </motion.div>
          </div>
        </GridContainer>

        {/* Carousel Container - 全屏宽度，不受GridContainer限制 */}
        <div className="w-full overflow-hidden">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <div className="carousel-track flex gap-8 animate-carousel hover:animate-carousel-paused">
              {/* Render benefits twice for seamless loop */}
              {[...benefits, ...benefits].map((benefit, index) => (
                <motion.div key={index} variants={fadeInVariants} className="perspective-1000 flex-shrink-0 w-96">
                  <div className="group relative w-full h-96 cursor-pointer">
                    {/* Card Container with 3D Transform - hover时暂停移动 */}
                    <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180 group-hover:animate-carousel-paused">
                      {/* Front Side - 白色背景，无边框 */}
                      <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-lg shadow-sm flex flex-col items-center justify-center p-8">
                        <Image
                          src={benefit.image || "/placeholder.svg"}
                          alt={benefit.title}
                          width={128}
                          height={128}
                          className="object-contain"
                        />
                        <h3 className="mt-6 text-xl font-semibold text-[#3C4043] text-center">{benefit.title}</h3>
                      </div>

                      {/* Back Side - 白色背景，无边框，内容左对齐，增加padding */}
                      <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white rounded-lg shadow-sm flex flex-col justify-center p-8">
                        <div className="flex items-start justify-start mb-6">
                          <Image
                            src="/images/dots-pattern.png"
                            alt="Dots pattern"
                            width={24}
                            height={20}
                            className="object-contain"
                          />
                        </div>

                        <h3 className="text-xl font-semibold text-[#3C4043] mb-4 text-left">{benefit.title}</h3>

                        <p className="text-sm text-gray-700 leading-relaxed text-left overflow-y-auto">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA Section - Full Screen - 白色背景 */}
      <section className="h-screen flex items-center justify-center bg-white">
        <GridContainer>
          <div className="px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInVariants}
              className="text-center max-w-2xl mx-auto"
            >
              <h3
                className="text-8xl font-bold mb-32"
                style={{ fontFamily: "var(--font-poppins), sans-serif", lineHeight: "1.25" }}
              >
                <span className="text-[#3C4043]">Ready to Join</span>
                <br />
                <span className="text-[#3DB7EA]">Our Team</span>
                <span className="text-[#3C4043]">?</span>
              </h3>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                Send your resume and cover letter to start your journey with FFT Investment.
              </p>
              <a
                href="/contact"
                className="inline-block bg-[#3DB7EA] text-white px-16 py-5 rounded-full text-lg font-medium hover:bg-[#2da5d9] transition-colors duration-300"
              >
                Apply Now
              </a>
            </motion.div>
          </div>
        </GridContainer>
      </section>

      {/* Job Details Modal */}
      {isModalOpen && selectedPosition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={closeModal} />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)",
            }}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-[#3DB7EA] to-[#2da5d9] text-white p-8">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 grid grid-cols-3 gap-2">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
                  ))}
                </div>
              </div>

              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <motion.h2
                    className="text-3xl font-bold mb-3"
                    style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    {selectedPosition.title}
                  </motion.h2>
                  <motion.div
                    className="flex items-center text-blue-100 text-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <div className="flex items-center bg-white/20 rounded-full px-4 py-2 mr-4">
                      <MapPin size={18} className="mr-2" />
                      <span className="font-medium">{selectedPosition.location}</span>
                    </div>
                    <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                      <Clock size={18} className="mr-2" />
                      <span className="font-medium">{selectedPosition.type}</span>
                    </div>
                  </motion.div>
                </div>
                <motion.button
                  onClick={closeModal}
                  className="p-3 hover:bg-white/20 rounded-full transition-all duration-300 group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={28} className="group-hover:rotate-90 transition-transform duration-300" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(85vh-180px)] custom-scrollbar">
              {/* Description */}
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-1 h-8 bg-[#3DB7EA] rounded-full mr-4"></div>
                  <h3
                    className="text-2xl font-bold text-[#3C4043]"
                    style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                  >
                    Position Overview
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg pl-6">{selectedPosition.description}</p>
              </motion.div>

              {/* Responsibilities */}
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-1 h-8 bg-[#3DB7EA] rounded-full mr-4"></div>
                  <h3
                    className="text-2xl font-bold text-[#3C4043]"
                    style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                  >
                    Key Responsibilities
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 pl-6">
                  {selectedPosition.responsibilities?.map((responsibility, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1, duration: 0.4 }}
                    >
                      <div className="w-6 h-6 bg-[#3DB7EA] rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-gray-700 leading-relaxed">{responsibility}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Requirements */}
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-1 h-8 bg-[#3DB7EA] rounded-full mr-4"></div>
                  <h3
                    className="text-2xl font-bold text-[#3C4043]"
                    style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                  >
                    Requirements
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 pl-6">
                  {selectedPosition.requirements?.map((requirement, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-start p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + idx * 0.1, duration: 0.4 }}
                    >
                      <div className="w-6 h-6 bg-[#3DB7EA] rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-gray-700 leading-relaxed">{requirement}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Qualifications */}
              {selectedPosition.qualifications && (
                <motion.div
                  className="mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-8 bg-gray-400 rounded-full mr-4"></div>
                    <h3
                      className="text-2xl font-bold text-[#3C4043]"
                      style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                    >
                      Preferred Qualifications
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 pl-6">
                    {selectedPosition.qualifications.map((qualification, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-start p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + idx * 0.1, duration: 0.4 }}
                      >
                        <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-gray-700 leading-relaxed">{qualification}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Apply Section */}
              <motion.div
                className="border-t border-gray-200 pt-8 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                  <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
                    <div className="text-center lg:text-left">
                      <h4
                        className="text-xl font-bold text-[#3C4043] mb-2"
                        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                      >
                        Ready to Join Our Team?
                      </h4>
                      <p className="text-gray-600">
                        Send us your application and let's start this exciting journey together.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <motion.button
                        onClick={closeModal}
                        className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Close
                      </motion.button>
                      <motion.a
                        href="/contact"
                        className="px-8 py-3 bg-gradient-to-r from-[#3DB7EA] to-[#2da5d9] text-white rounded-full hover:from-[#2da5d9] hover:to-[#1e90c7] transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Apply Now
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  )
}
