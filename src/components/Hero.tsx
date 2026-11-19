import { ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../data/products';
import { SafeImage } from './SafeImage';

export function Hero() {
  return (
    <section
      id="top"
      className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-8 lg:pt-14 lg:pb-24"
    >
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col justify-center lg:col-span-5">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
            <span>2026 가을 컬렉션</span>
            <span aria-hidden="true">·</span>
            <span>서울 성수 스튜디오</span>
          </div>

          <h1
            className="font-display mt-4 font-medium tracking-tight text-zinc-950"
            style={{
              fontSize: 'clamp(2.1rem, 3.6vw, 3.25rem)',
              lineHeight: 1.24,
              textWrap: 'balance',
            }}
          >
            일상의 여백을 채우는 단정한 오브제
          </h1>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-zinc-600">
            손으로 빚은 무광 백자부터 은은한 빛을 머금은 알루미늄 조명,
            자연스러운 워시드 린넨까지. 오래 두고 써도 질리지 않는 생활 사물을
            소량으로 제안합니다.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <a
              href="#collection"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#1f3a3d] px-6 py-3 text-sm font-medium text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#162b2d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3a3d]"
            >
              <span>컬렉션 보기</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#story"
              className="inline-flex min-h-[44px] items-center px-1 text-sm font-medium text-zinc-700 underline decoration-stone-300 underline-offset-4 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-zinc-950 hover:decoration-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f3a3d]"
            >
              제작 방식 보기
            </a>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="h-full overflow-hidden rounded-lg bg-stone-100">
            <SafeImage
              src={HERO_IMAGE}
              alt="석회석 콘솔 위에 놓인 무광 백자 오브제와 브러시드 알루미늄 테이블 램프, 린넨 패브릭"
              fallbackLabel="모노 오브제 2026 가을 컬렉션"
              className="aspect-[16/10] w-full object-cover lg:aspect-auto lg:h-full lg:min-h-[440px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
