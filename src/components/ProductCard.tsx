import { Plus } from 'lucide-react';
import { formatKRW, type Product } from '../data/products';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export function ProductCard({
  product,
  onSelect,
  onQuickAdd,
}: ProductCardProps) {
  return (
    <article className="group flex flex-col rounded-lg border border-stone-200/80 bg-white transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:border-stone-300">
      <button
        type="button"
        onClick={() => onSelect(product)}
        className="block w-full overflow-hidden rounded-t-[7px] bg-stone-100 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1f3a3d] cursor-pointer"
        aria-label={`${product.name} 상세 보기`}
      >
        <SafeImage
          src={product.image}
          alt={product.name}
          fallbackLabel={product.name}
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
        />
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span>{product.category}</span>
          {product.note && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-[#1f3a3d]">{product.note}</span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelect(product)}
          className="mt-1.5 text-left text-base font-semibold text-zinc-900 transition-colors duration-150 hover:text-[#1f3a3d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3a3d] cursor-pointer"
        >
          {product.name}
        </button>

        <p className="mt-1 text-sm text-zinc-500">{product.summary}</p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-5">
          <span className="text-[15px] font-semibold tabular-nums text-zinc-950">
            {formatKRW(product.price)}
          </span>

          <button
            type="button"
            onClick={() => onQuickAdd(product)}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-stone-300 bg-white px-3.5 py-2 text-xs font-medium text-zinc-800 whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#1f3a3d] hover:bg-[#1f3a3d] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3a3d] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>담기</span>
          </button>
        </div>
      </div>
    </article>
  );
}
