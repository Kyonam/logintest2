import { useEffect, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { formatKRW, type Product } from '../data/products';
import { SafeImage } from './SafeImage';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, option: string, quantity: number) => void;
}

export function ProductModal({
  product,
  onClose,
  onAddToCart,
}: ProductModalProps) {
  const [selectedOption, setSelectedOption] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedOption(product.options[0] ?? '기본');
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const handleConfirm = () => {
    onAddToCart(product, selectedOption, quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
    >
      <div
        className="relative grid max-h-[90vh] w-full max-w-3xl grid-cols-1 overflow-y-auto rounded-xl bg-white shadow-xl md:grid-cols-12"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="상세 창 닫기"
          className="absolute top-3 right-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/90 text-zinc-700 transition-colors hover:bg-stone-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-[#1f3a3d] cursor-pointer"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="bg-stone-100 md:col-span-6">
          <SafeImage
            src={product.image}
            alt={product.name}
            fallbackLabel={product.name}
            className="aspect-[4/3] h-full w-full object-cover md:aspect-auto"
          />
        </div>

        <div className="flex flex-col p-6 sm:p-7 md:col-span-6">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span>{product.category}</span>
            {product.note && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-[#1f3a3d]">{product.note}</span>
              </>
            )}
          </div>

          <h2
            id="product-modal-title"
            className="font-display mt-2 text-xl font-medium text-zinc-950"
          >
            {product.name}
          </h2>

          <p className="mt-2 text-lg font-semibold tabular-nums text-zinc-950">
            {formatKRW(product.price)}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-zinc-600">
            {product.description}
          </p>

          <dl className="mt-5 space-y-2 border-y border-stone-200 py-4 text-xs">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">소재</dt>
              <dd className="text-right font-medium text-zinc-800">
                {product.material}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">크기</dt>
              <dd className="text-right font-medium tabular-nums text-zinc-800">
                {product.dimensions}
              </dd>
            </div>
          </dl>

          <div className="mt-5">
            <span className="block text-xs font-medium text-zinc-600">
              옵션 선택
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.options.map((option) => {
                const isSelected = option === selectedOption;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedOption(option)}
                    className={`min-h-[40px] rounded-md border px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#1f3a3d] bg-[#1f3a3d] text-white'
                        : 'border-stone-300 bg-white text-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 pt-2">
            <div className="inline-flex min-h-[44px] items-center rounded-md border border-stone-300 bg-white">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                aria-label="수량 감소"
                className="inline-flex h-11 w-10 items-center justify-center text-zinc-700 hover:bg-stone-100 cursor-pointer"
              >
                <Minus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <span className="w-8 text-center text-sm font-medium tabular-nums text-zinc-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                aria-label="수량 증가"
                className="inline-flex h-11 w-10 items-center justify-center text-zinc-700 hover:bg-stone-100 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="min-h-[44px] flex-1 rounded-md bg-[#1f3a3d] px-5 py-2.5 text-sm font-medium text-white whitespace-nowrap transition-colors hover:bg-[#162b2d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3a3d] cursor-pointer"
            >
              장바구니 담기 · {formatKRW(product.price * quantity)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
