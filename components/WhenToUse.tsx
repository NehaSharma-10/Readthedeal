'use client';

export default function WhenToUse() {
  const folders = [
    'Gym or studio membership',
    'Apartment lease',
    'Freelance or contractor agreement',
    'Software subscription / free trial',
    'Job offer or NDA',
    'Literally any "I agree" button'
  ];

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-7">
        <div className="mb-11">
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-[#222F95] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FFD23F] shadow-[0_0_0_3px_#FBE7C6]" />
            When to use it
          </div>
          <h2 className="text-[clamp(26px,3vw,36px)] leading-tight font-serif font-bold text-[#211D17]">
            Anytime you're about to sign something.
          </h2>
        </div>

        <div className="flex flex-wrap gap-3.5">
          {folders.map((folder, idx) => (
            <div key={idx} className="bg-white border border-[#E4DAC2] rounded-t-[10px] rounded-b-sm px-4.5 py-3.5 text-sm font-medium shadow-[0_2px_0_#E4DAC2] relative" 
                 style={{ paddingTop: '30px' }}>
              <div className="absolute -top-2 left-3.5 w-9 h-2 bg-white border border-[#E4DAC2] border-b-0 rounded-t-[5px]" />
              {folder}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
