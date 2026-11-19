import type { ProductCategory } from '../data/products';

interface FooterProps {
  onNavigateCategory: (category: ProductCategory) => void;
}

export function Footer({ onNavigateCategory }: FooterProps) {
  return (
    <footer className="border-t border-stone-200 bg-[#fafaf9] py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8">
        <div>
          <p className="font-display text-base font-semibold text-zinc-900">
            모노 오브제
          </p>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            서울시 성동구 연무장길 48, 2층 스튜디오 · 평일 10:00 – 18:00
            <br />
            고객 문의 help@monoobjet.kr · 02-6412-0840
          </p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <nav aria-label="하단 메뉴" className="flex flex-wrap gap-6 text-xs text-zinc-600">
            <a
              href="#collection"
              onClick={() => onNavigateCategory('전체')}
              className="hover:text-zinc-950 whitespace-nowrap"
            >
              전체 컬렉션
            </a>
            <a
              href="#collection"
              onClick={() => onNavigateCategory('테이블웨어')}
              className="hover:text-zinc-950 whitespace-nowrap"
            >
              테이블웨어
            </a>
            <a
              href="#collection"
              onClick={() => onNavigateCategory('조명')}
              className="hover:text-zinc-950 whitespace-nowrap"
            >
              조명
            </a>
            <a
              href="#collection"
              onClick={() => onNavigateCategory('패브릭')}
              className="hover:text-zinc-950 whitespace-nowrap"
            >
              패브릭
            </a>
            <a href="#story" className="hover:text-zinc-950 whitespace-nowrap">
              브랜드 소개
            </a>
          </nav>
          <p className="text-xs text-zinc-400">
            © 2026 MONO OBJET. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
