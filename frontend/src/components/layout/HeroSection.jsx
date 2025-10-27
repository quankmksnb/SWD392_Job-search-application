import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="flex justify-center px-[24px] py-[30px] bg-gradient-to-b from-[#f8f9fa] to-white">
      <div className="container">
        <div className=" mx-auto text-center">
          <h1 className="text-5xl font-bold text-[#191919] mb-6">
            Tìm công việc mơ ước của bạn
          </h1>
          <p className="text-xl text-[#707070] mb-8">
            Khám phá hàng ngàn cơ hội việc làm từ các công ty hàng đầu. Nâng cao
            sự nghiệp của bạn ngay hôm nay.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 text-lg font-semibold bg-[#0968f6] text-white border-2 rounded-lg hover:bg-[#f0f7ff] hover:text-[#0968f6] transition"
            >
              Bắt đầu tìm kiếm
            </Link>
            <Link
              href="/"
              className="px-8 py-3 text-lg font-semibold text-[#0968f6] border-2 border-[#0968f6] rounded-lg hover:bg-[#0968f6] hover:text-[#f0f7ff] transition"
            >
              Xem công ty
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
