import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      {/* Hero Banner */}
      <div className="relative bg-gold-600 text-white py-24">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-display font-medium text-center mb-4">
            เกี่ยวกับเรา
          </h1>
          <p className="text-center text-white/90 max-w-2xl mx-auto">
            เบญจภัณฑ์๕ ร้านทองและเครื่องประดับมงคล ที่มีประสบการณ์มากกว่า 30 ปี
          </p>
        </div>
        <div className="absolute inset-0 opacity-15 lotus-pattern"></div>
      </div>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1374&auto=format&fit=crop"
                alt="ประวัติร้านเบญจภัณฑ์๕"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-heading font-medium text-brown-800 mb-6">
                เรื่องราวของเรา
              </h2>
              <p className="text-brown-600 mb-4">
                เบญจภัณฑ์ ๕ ธุรกิจที่มุ่งมั่นสร้างสรรค์ ผลิตภัณฑ์สายบุญ สายมู
                เพื่อเป็นอีกหนึ่งสื่อกลางในการส่งต่อแรงศรัทธาและความเชื่ออย่างถูกวิธี
                ซึ่งกำเนิดขึ้นจากแรงศรัทธาและความเชื่อในศาสตร์แห่งบุญและทานบารมี
                อันมีรากฐานจากพระพุทธศาสนา โดยมี พระสัมมาสัมพุทธเจ้า
                เป็นองค์ปฐมแห่งความดีงาม และ พญานาคราช
               เจ้าแห่งขุมทรัพย์แห่งเมืองบาดาล
                ผู้ปกปักษ์รักษาและทำนุบำรุงพระศาสนา
                สืบสานความเชื่อจากรุ่นสู่รุ่นจวบจนกาลปัจจุบัน
              </p>
              <p className="text-brown-600 mb-4">
                ตามความเชื่อโบราณ พญานาคราช จะประทานพรด้านทรัพย์ โชคลาภ
                และความสำเร็จ แด่ผู้ที่ตั้งมั่นในศีลธรรม มีสัจจะ
                ซื่อสัตย์ในทางธรรม และขยันหมั่นสร้างบุญ สั่งสมบารมี
              </p>
              <p className="text-brown-600 mb-4">
                จากศรัทธาอันแน่วแน่และความตั้งใจจริงของเจ้าของแบรนด์
              </p>
              <p className="text-brown-600">
                เบญจภัณฑ์ ๕ อยากเป็นส่วนหนึ่งในการช่วยให้ทุกคำขอของลูกค้า
                ได้เชื่อมโยงกับบุญอย่างถูกต้อง ตรงกับเจตจำนงและความตั้งใจ
                เพื่อผลบุญที่สัมฤทธิ์ผล และพรที่ได้รับจะเป็นพลังแห่งความสุข
                ความสำเร็จ ในทุกด้านของชีวิตอย่างแท้จริง
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 lotus-pattern">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-medium text-brown-800 text-center mb-12">
            คุณค่าของเรา
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-8 h-8 text-gold-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-brown-800 text-center mb-3">
                คุณภาพเป็นเลิศ
              </h3>
              <p className="text-brown-600 text-center">
                เรามุ่งมั่นในการสร้างสรรค์เครื่องประดับทองคำแท้คุณภาพสูง
                ผ่านการคัดสรรวัตถุดิบอย่างพิถีพิถัน
                และกระบวนการผลิตที่ได้มาตรฐาน
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-8 h-8 text-gold-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-brown-800 text-center mb-3">
                ความซื่อสัตย์
              </h3>
              <p className="text-brown-600 text-center">
                เราดำเนินธุรกิจด้วยความซื่อสัตย์ โปร่งใส และเป็นธรรม
                ทั้งต่อลูกค้า พนักงาน และคู่ค้า
                เพื่อสร้างความไว้วางใจและความสัมพันธ์ที่ยั่งยืน
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-8 h-8 text-gold-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-brown-800 text-center mb-3">
                ความพึงพอใจของลูกค้า
              </h3>
              <p className="text-brown-600 text-center">
                เราให้ความสำคัญกับความพึงพอใจของลูกค้าเป็นอันดับหนึ่ง
                ด้วยการให้บริการที่ประทับใจ
                และการสร้างประสบการณ์ที่ดีในทุกขั้นตอน
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-medium text-brown-800 text-center mb-4">
            ทีมงานของเรา
          </h2>
          <p className="text-brown-600 text-center max-w-2xl mx-auto mb-12">
            พบกับทีมงานผู้เชี่ยวชาญของเรา ที่พร้อมให้คำปรึกษาและบริการด้วยใจ
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                name: "คุณเบญจพรรณ",
                role: "ผู้ก่อตั้งและผู้จัดการ",
                image: "/team/founder.jpg",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={
                      member.image || "/placeholder.svg?height=192&width=192"
                    }
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-medium text-brown-800 mb-1">
                  {member.name}
                </h3>
                <p className="text-gold-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
