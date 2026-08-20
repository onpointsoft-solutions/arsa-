export default function CTABanner() {
  return (
    <div className="relative h-80 md:h-96 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&h=600&fit=crop&auto=format"
        alt="Estate aerial view"
        className="w-full h-full object-cover"
        style={{ objectPosition: 'center 40%' }}
      />
      <div className="absolute inset-0 bg-[#1b4332]/75" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <p className="text-[#40916c] text-xs tracking-[0.3em] uppercase mb-4 font-medium">
          Exceptional Properties
        </p>
        <h2 className="font-display text-4xl md:text-6xl italic text-white">
          "The World's Most Beautiful<br />
          Homes, Privately Placed"
        </h2>
      </div>
    </div>
  )
}
