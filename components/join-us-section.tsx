"use client"

import { motion } from "framer-motion"

export default function JoinUsSection() {
  const benefits = [
    {
      title: "Competitive Compensation",
      description: "Industry-leading salary and performance bonuses",
    },
    {
      title: "Professional Development",
      description: "Continuous learning opportunities and career advancement",
    },
    {
      title: "Work-Life Balance",
      description: "Flexible working arrangements and generous time off",
    },
    {
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs",
    },
  ]

  const positions = [
    {
      title: "Senior Investment Analyst",
      description: "Lead investment research and develop strategic recommendations for clients.",
      location: "Shanghai · Full-time",
    },
    {
      title: "Wealth Management Advisor",
      description: "Provide personalized financial advice and build long-term client relationships.",
      location: "Beijing · Full-time",
    },
    {
      title: "Market Research Specialist",
      description: "Analyze market trends and prepare comprehensive investment reports.",
      location: "Shenzhen · Full-time",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-16">
        <motion.div
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.h3
            className="text-3xl font-semibold text-[#3C4043]"
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
            }}
          >
            Benefits
          </motion.h3>

          <motion.div
            className="space-y-4"
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } },
            }}
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#3C4043] mt-1"></div>
                <div className="ml-4">
                  <h4 className="text-xl font-medium text-[#3C4043]">{benefit.title}</h4>
                  <div className="mt-1 text-gray-600">{benefit.description}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.h3
            className="text-3xl font-semibold text-[#3C4043]"
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
            }}
          >
            Open Positions
          </motion.h3>

          <motion.div
            className="space-y-6"
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } },
            }}
          >
            {positions.map((position, index) => (
              <div
                key={index}
                className="p-6 border border-gray-200 rounded-lg hover:border-[#3C4043] transition-colors duration-300 cursor-pointer"
              >
                <h4 className="text-xl font-medium text-[#3C4043]">{position.title}</h4>
                <div className="mt-2 text-gray-600">{position.description}</div>
                <div className="mt-4 text-sm font-medium">{position.location}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
