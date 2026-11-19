const SERVICE_FACTS = [
  {
    value: '14:00',
    label: '평일 오후 2시 이전 주문 시 성수 물류센터에서 당일 출고됩니다.',
  },
  {
    value: '50,000원',
    label: '5만 원 이상 구매 시 전국 무료배송 및 완충 안전 포장을 제공합니다.',
  },
  {
    value: '30일',
    label: '제품 수령 후 30일 이내 미사용 상품에 한해 무료 교환·반품이 가능합니다.',
  },
];

export function BrandStory() {
  return (
    <section
      id="story"
      className="border-t border-stone-200 bg-stone-100/60 py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium text-zinc-500">브랜드 소개</p>
            <h2
              className="font-display mt-3 text-2xl font-medium tracking-tight text-zinc-950 sm:text-3xl"
              style={{ textWrap: 'balance' }}
            >
              과장 없는 재료와 단단한 쓰임새
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-zinc-600">
              모노 오브제는 유행을 쫓기보다 매일 손이 가는 물건의 비례와
              촉감에 집중합니다. 국내 도예·금속 공방과 협업해 꼭 필요한
              수량만 정성스럽게 제작하며, 모든 제품은 출고 전 개별 검수를
              거칩니다.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-7 lg:items-start lg:pt-6">
            {SERVICE_FACTS.map((fact) => (
              <div
                key={fact.value}
                className="border-t border-stone-300 pt-4"
              >
                <div className="text-2xl font-semibold tracking-tight tabular-nums text-zinc-950">
                  {fact.value}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {fact.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
