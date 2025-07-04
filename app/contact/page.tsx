"use client"

import { motion } from "framer-motion"
import Navbar from "@/components/navbar"
import GridContainer from "@/components/grid-container"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-[#3C4043]">
      <Navbar showLogo={true} />

      {/* Contact Section - Full Screen */}
      <section className="h-screen flex items-center justify-center">
        <GridContainer>
          <div className="w-full px-0">
            <div className="max-w-7xl mx-auto">
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center h-full">
                {/* Left Side - Title and Contact Information */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="space-y-12"
                >
                  {/* Contact us Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-8xl font-bold text-[#3DB7EA] mb-20"
                    style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                  >
                    Contact&nbsp;us
                  </motion.h1>

                  {/* Company Info with Logo */}
                  <div className="flex items-center space-x-4 mb-8">
                    <img src="/images/new-logo.png" alt="FFT Logo" className="h-12 w-auto" />
                    <div>
                      <h2 className="text-2xl font-bold text-[#3C4043]">FFT INVESTMENT</h2>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-12">
                    <p className="text-lg text-[#3C4043] leading-relaxed">
                      4803-4805, TOWER 1, GRAND GATEWAY 66, XUHUI DISTRICT, SHANGHAI
                    </p>
                  </div>

                  {/* Contact Methods - Left Right Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Email - Left */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#3C4043] mb-2">Email</h3>
                      <div className="space-y-1">
                        <p>
                          <a
                            href="mailto:info@fft.fund"
                            className="text-[#3DB7EA] hover:text-[#2da5d9] transition-colors duration-300"
                          >
                            info@fft.fund
                          </a>
                        </p>
                        <p>
                          <a
                            href="mailto:careers@fft.fund"
                            className="text-[#3DB7EA] hover:text-[#2da5d9] transition-colors duration-300"
                          >
                            careers@fft.fund
                          </a>
                        </p>
                      </div>
                    </div>

                    {/* Phone - Right */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#3C4043] mb-2">Phone</h3>
                      <p>
                        <a
                          href="tel:+862154665000"
                          className="text-[#3DB7EA] hover:text-[#2da5d9] transition-colors duration-300"
                        >
                          +86 21 5466 5000
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Business Hours */}
                </motion.div>

                {/* Right Side - Map */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="h-[600px]"
                >
                  <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm h-full relative">
                    {/* Interactive Map */}
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3412.0234567890123!2d121.43567890123456!3d31.19876543210987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35b270a0a1234567%3A0x1234567890abcdef!2sGrand%20Gateway%2066%2C%20Xuhui%20District%2C%20Shanghai%2C%20China!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                    />

                    {/* Map Overlay with Company Info */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#3DB7EA] rounded-full mr-3"></div>
                        <div>
                          <h4 className="font-semibold text-[#3C4043]">FFT Investment</h4>
                          <p className="text-sm text-gray-600">Grand Gateway 66, Xuhui District</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transportation Info */}
                </motion.div>
              </div>
            </div>
          </div>
        </GridContainer>
      </section>
    </main>
  )
}
