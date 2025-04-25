import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/data";
import Image from "next/image";

export default function AuspiciousPage() {
  // Filter products for auspicious items (in a real app, you'd have a specific category or tag)
  const auspiciousProducts = products.slice(0, 8); // Just using some products for demo

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      {/* Hero Banner */}
      <div className="relative bg-gold-600 text-white py-24">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-display font-medium text-center mb-4">
            ของดีมีศรัทธา เสริมบุญหนา วาสนาเปล่งประกาย
          </h1>
          <p className="text-center text-white/90 max-w-2xl mx-auto">
            เสริมพลังชีวิต ปรับสมดุลดวงชะตา พร้อมดีไซน์มีสไตล์
          </p>
        </div>
        <div className="absolute inset-0 opacity-15 lotus-pattern"></div>
      </div>

      {/* Auspicious Jewelry Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-medium text-brown-800 mb-6">
                เครื่องประดับมงคล
                <br />
                เสริมดวงชะตา
              </h2>
              <p className="text-brown-600 mb-4">
                เครื่องประดับมงคลของเบญจภัณฑ์๕
                ออกแบบโดยผู้เชี่ยวชาญด้านโหราศาสตร์ไทย
                ผสมผสานความเชื่อดั้งเดิมกับการออกแบบที่ทันสมัย
                เพื่อสร้างเครื่องประดับที่ไม่เพียงแต่สวยงาม
                แต่ยังช่วยเสริมดวงชะตาและปกป้องผู้สวมใส่
              </p>
              <p className="text-brown-600 mb-4">
                ทุกชิ้นผลิตจากทองคำแท้คุณภาพสูง
                ผ่านพิธีปลุกเสกโดยพระอาจารย์ที่มีชื่อเสียง
                เพื่อเพิ่มพลังมงคลและความศักดิ์สิทธิ์ให้กับเครื่องประดับ
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center mr-4 mt-1">
                    <svg
                      className="w-5 h-5 text-gold-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-brown-800 mb-1">
                      เสริมโชคลาภ การเงิน
                    </h3>
                    <p className="text-brown-600">
                      ช่วยดึงดูดโชคลาภ เงินทอง และความมั่งคั่งเข้าสู่ชีวิต
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center mr-4 mt-1">
                    <svg
                      className="w-5 h-5 text-gold-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-brown-800 mb-1">
                      ปกป้องคุ้มครอง
                    </h3>
                    <p className="text-brown-600">
                      ป้องกันสิ่งชั่วร้าย อุบัติเหตุ และภัยอันตรายต่างๆ
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center mr-4 mt-1">
                    <svg
                      className="w-5 h-5 text-gold-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-brown-800 mb-1">
                      เสริมเสน่ห์ ความรัก
                    </h3>
                    <p className="text-brown-600">
                      ช่วยเสริมเสน่ห์ ดึงดูดความรัก
                      และเสริมความสัมพันธ์ให้แน่นแฟ้น
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=1374&auto=format&fit=crop"
                alt="เครื่องประดับมงคล"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 lotus-pattern">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-medium text-brown-800 text-center mb-12">
            เครื่องประดับมงคลของเรา
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {auspiciousProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* naga Section */}
      <section className="py-16  bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-medium text-brown-800 text-center mb-4">
            ความหมายของพญานาค 4 ตระกูล
          </h2>
          <p className="text-brown-600 text-center max-w-7xl mx-auto mb-12">
            เลือกเครื่องประดับที่เหมาะกับราศีของคุณ
            เพื่อเสริมดวงชะตาและพลังมงคลให้ตรงกับธาตุประจำราศี
          </p>
          <div className="ml-[200px] max-w-[1500px]">
            {/* เนื้อหาส่วนที่ 1 */}
            <div className="flex flex-col md:flex-row items-center mb-16 ml-4">
              <div className="w-[350px] h-[350px] mb-6 md:mb-0 pt-[55px]">
                <img
                  src="/naga1.png"
                  alt="พญานาคตระกูล 1"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
              <div className="w-full md:w-1/2 md:pl-12">
                <h3 className="text-2xl font-semibold text-brown-800 mb-4">
                  ตระกูลวิรูปักข์
                </h3>
                <p className="text-brown-600 leading-relaxed">
                  พญานาคตระกูลที่มีผิวกายหรือเกล็ดเป็นสีทองงดงามมาก
                  เป็นนาคชั้นสูงสุด ถือกำเนิดแบบโอปปาติกะ
                  คือเกิดขึ้นเองแล้วโตเลย มากด้วยอิทธิฤทธิ์และบุญบารมี
                  มักถูกจัดอยู่ในชั้นเทพ พำนักอาศัยอยู่ในทิพย์วิมาน
                  อีกทั้งยังเป็นชนชั้นปกครองที่คอยปกครองนาคทั้งหลาย
                  ไม่เกรงกลัวแม้มนต์สะกดอาลัมพายน์ของพญาครุฑ
                  พญานาคในตระกูลนี้ที่รู้จักกันดี อาทิ พญาสุวรรณนาคราช
                  พญามุจลินท์นาคราช
                </p>
              </div>
            </div>

            {/* เนื้อหาส่วนที่ 2 */}
            <div className="flex flex-col md:flex-row items-center mb-16">
              <div className="w-full md:w-1/2 md:pr-12 order-2 md:order-1">
                <h3 className="text-2xl font-semibold text-brown-800 mb-4">
                  ตระกูลเอราปถะ
                </h3>
                <p className="text-brown-600 leading-relaxed">
                  พญานาคตระกูลที่มีผิวกายหรือเกล็ดเป็นสีเขียว
                  ถือว่าเป็นพญานาคชั้นสูง
                  มักจะถือกำเนิดแบบโอปปาติกะคำเนิดขึ้นเอง
                  หรือแบบอัณฑะชะคือกำเนิดจากฟองไข่
                  มีขนาดใหญ่โตใกล้เคียงกับพญานาคตระกูลสีทอง
                  อาศัยอยู่เมืองบาดาลไม่ลึกมาก
                  เป็นตระกูลที่พบได้มากที่สุดและใกล้ชิดมนุษย์มากที่สุด
                  ชอบขึ้นมาเที่ยวบนโลกมนุษย์จนเกิดเป็นตำนานรักมากมายกับเหล่ามนุษย์
                  และหากบำเพ็ญเพียงบารมีจนแกร่งกล้า ก็จะสามารถแผ่เศียรได้ถึง 9
                  เศียรได้เช่นกัน ก็สามารถขึ้นเป็นพญานาคชั้นปกครองได้เช่นกัน
                  พญานาคในตระกูลนี้ที่รู้จักกันดี คือ
                  พญาศรีสุทโธนาคราชแห่งเวียงวังนาคินทร์คำโชนด
                </p>
              </div>
              <div className="w-[350px] h-[350px] order-1 md:order-2 mb-6 md:mb-0 pt-[55px]">
                <img
                  src="/naga2.png"
                  alt="พญานาคตระกูล 2"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* เนื้อหาส่วนที่ 3 */}
            <div className="flex flex-col md:flex-row items-center mb-16">
              <div className="w-[350px] h-[350px] mb-6 md:mb-0 pt-[55px]">
                <img
                  src="/naga3.png"
                  alt="พญานาคตระกูล 1"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
              <div className="w-full md:w-1/2 md:pl-12">
                <h3 className="text-2xl font-semibold text-brown-800 mb-4">
                  ตระกูลฉัพพยาปุตตะ
                </h3>
                <p className="text-brown-600 leading-relaxed">
                  พญานาคตระกูลที่มีผิวกายหรือเกล็ดเป็นสีรุ้ง
                  ส่วนใหญ่ถือกำเนิดแบบชลาพุชะ คือกำเนิดจากครรภ์
                  อาศัยอยู่ในนครบาดาลหรือป่าลึก
                  เป็นพญานาคที่มีความงดงามมากเพราะมักจะมีเกล็ดเหลื่อมหลากสี
                  สวยเหมือนสีรุ้ง มีอิทธิฤทธิ์มาก แต่มักพบได้ยาก
                  เพราะมักอาศัยอยู่นที่ลึกลับ
                </p>
              </div>
            </div>

            {/* เนื้อหาส่วนที่ 4 */}
            <div className="flex flex-col md:flex-row items-center mb-16">
              <div className="w-full md:w-1/2 md:pr-12 order-2 md:order-1">
                <h3 className="text-2xl font-semibold text-brown-800 mb-4">
                  ตระกูลกัณหาโคตะมะ
                </h3>
                <p className="text-brown-600 leading-relaxed">
                  พญานาคตระกูลที่มีผิวกายหรือเกล็ดเป็นสีดำนิลกาฬ
                  ส่วนใหญ่ถือกำเนิดแบบสังเสทชะคือเกิดจากเหงื่อไคลและสิ่งหมักหมมต่างๆ
                  หรือแบบอัณฑชะคือเกิดจากไข่ มักมีร่างกายกำยำบึกบึน
                  แม้ไม่ถือว่าเป็นนาคชั้นสูง
                  แต่ก็มีอำนาจและอิทธิฤทธ์ปฏิหารย์ไม่แพ้ตระกูลอื่น พบเจอได้ยาก
                  ชอบอาศัยในท้องน้ำลึกและที่เร้นลับ
                  มักจะมีหน้าที่เฝ้าสมบัติของเมืองบาดาล
                  และแม้จะเกิดในตระกูลที่ต่ำกว่าตระกูลอื่น
                  แต่หากหมั่นบำเพ็ญเพียรจนมากญาณบารมี
                  ก็สามารถเป็นพญานาคชั้นปกครองได้เช่นกัน
                  พญานาคในตระกูลนี้ที่รู้จักกันดี คือ องค์ดำแสนสิริจันทรานาคราช
                  กษัตริย์นาคราชยอดนักรบแห่งเมืองบาดาล
                </p>
              </div>
              <div className="w-[350px] h-[350px] order-1 md:order-2 mb-6 md:mb-0 pt-[55px]">
                <img
                  src="/naga4.png"
                  alt="พญานาคตระกูล 2"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
