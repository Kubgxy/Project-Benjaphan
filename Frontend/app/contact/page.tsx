import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      {/* Hero Banner */}
      <div className="relative bg-gold-600 text-white py-24">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-display font-medium text-center mb-4">ติดต่อเรา</h1>
          <p className="text-center text-white/90 max-w-2xl mx-auto">
            มีคำถามหรือต้องการคำแนะนำ? เราพร้อมให้บริการและตอบทุกคำถามของคุณ
          </p>
        </div>
        <div className="absolute inset-0 opacity-15 lotus-pattern"></div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-heading font-medium text-brown-800 mb-6">ข้อมูลการติดต่อ</h2>
              <p className="text-brown-600 mb-8">
                หากคุณมีคำถามเกี่ยวกับสินค้าหรือบริการของเรา สามารถติดต่อเราได้ตามช่องทางด้านล่างนี้
                ทีมงานของเราพร้อมให้บริการและตอบทุกคำถามของคุณ
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center mr-4">
                    <MapPin className="h-6 w-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-brown-800 mb-1">ที่อยู่</h3>
                    <p className="text-brown-600">
                      428/72 หมู่บ้านเดอะรีเจ้นท์ พระยาสุเรนทร์  11
                      <br />
                      แขวงบางชัน เขตคลองสามวา กรุงเทพฯ 10510
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center mr-4">
                    <Phone className="h-6 w-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-brown-800 mb-1">โทรศัพท์</h3>
                    <p className="text-brown-600">080-060-8407</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-brown-800 mb-1">อีเมล</h3>
                    <p className="text-brown-600">Nillawan41@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-brown-800 mb-1">เวลาทำการ</h3>
                    <p className="text-brown-600">จันทร์ - เสาร์: 9:00 - 18:00 น.</p>
                    <p className="text-brown-600">อาทิตย์: 10:00 - 16:00 น.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-brown-800 mb-4">ติดตามเรา</h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-gold-600 text-white flex items-center justify-center hover:bg-gold-700 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-gold-600 text-white flex items-center justify-center hover:bg-gold-700 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-heading font-medium text-brown-800 mb-6">ส่งข้อความถึงเรา</h2>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-brown-700 mb-1">
                      ชื่อ *
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-brown-700 mb-1">
                      อีเมล *
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-brown-700 mb-1">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-brown-700 mb-1">
                    หัวข้อ *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-brown-700 mb-1">
                    ข้อความ *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    required
                  ></textarea>
                </div>

                <Button type="submit" className="w-full bg-gold-600 hover:bg-gold-700">
                  ส่งข้อความ
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-medium text-brown-800 text-center mb-8">แผนที่และการเดินทาง</h2>
          <div className="h-[400px] rounded-lg overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5438161035395!2d100.50123!3d13.742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ0JzMxLjIiTiAxMDDCsDMwJzA0LjQiRQ!5e0!3m2!1sen!2sth!4v1617038260897!5m2!1sen!2sth"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

