import { useEffect, useState, type FormEvent } from 'react';
import { Check, Minus, Plus, Trash2, X } from 'lucide-react';
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
  formatKRW,
  type Product,
} from '../data/products';
import { SafeImage } from './SafeImage';

export interface CartItem {
  key: string;
  product: Product;
  option: string;
  quantity: number;
}

interface CompletedOrder {
  orderNumber: string;
  customerName: string;
  address: string;
  paymentMethod: string;
  totalAmount: number;
  itemCount: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'complete'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'신용카드' | '계좌이체' | '착불 결제'>(
    '신용카드',
  );
  const [formError, setFormError] = useState('');
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(
    null,
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && step === 'complete' && items.length > 0) {
      setStep('cart');
    }
  }, [isOpen, items.length, step]);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shippingFee =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal,
  );
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setFormError('수령인, 연락처, 배송지 주소를 모두 입력해 주세요.');
      return;
    }

    const orderNumber = `MO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setCompletedOrder({
      orderNumber,
      customerName: customerName.trim(),
      address: address.trim(),
      paymentMethod,
      totalAmount: total,
      itemCount: totalItemCount,
    });
    setFormError('');
    onClearCart();
    setStep('complete');
  };

  const handleCloseDrawer = () => {
    if (step === 'complete') {
      setStep('cart');
      setCompletedOrder(null);
      setCustomerName('');
      setPhone('');
      setAddress('');
    } else if (step === 'checkout') {
      setStep('cart');
      setFormError('');
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-zinc-950/40 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="장바구니"
      onClick={handleCloseDrawer}
    >
      <aside
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <h2 className="font-display text-lg font-medium text-zinc-950">
            {step === 'cart' && `장바구니 (${totalItemCount})`}
            {step === 'checkout' && '주문서 작성'}
            {step === 'complete' && '주문 접수 완료'}
          </h2>
          <button
            type="button"
            onClick={handleCloseDrawer}
            aria-label="장바구니 닫기"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-stone-100 hover:text-zinc-950 cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                  <p className="text-sm font-medium text-zinc-800">
                    장바구니에 담긴 상품이 없습니다.
                  </p>
                  <p className="mt-1.5 text-xs text-zinc-500">
                    마음에 드는 오브제를 담아 일상의 공간을 채워보세요.
                  </p>
                  <button
                    type="button"
                    onClick={handleCloseDrawer}
                    className="mt-6 min-h-[42px] rounded-md border border-stone-300 px-5 py-2 text-xs font-medium text-zinc-800 transition-colors hover:border-zinc-900 cursor-pointer"
                  >
                    컬렉션 둘러보기
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-stone-200">
                  {items.map((item) => (
                    <li key={item.key} className="flex gap-4 py-4 first:pt-0">
                      <div className="h-20 w-24 shrink-0 overflow-hidden rounded-md bg-stone-100">
                        <SafeImage
                          src={item.product.image}
                          alt={item.product.name}
                          fallbackLabel={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-zinc-900">
                              {item.product.name}
                            </p>
                            <p className="mt-0.5 text-xs text-zinc-500">
                              옵션: {item.option}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.key)}
                            aria-label={`${item.product.name} 삭제`}
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-stone-100 hover:text-zinc-800 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center rounded border border-stone-300">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.key, -1)}
                              aria-label="수량 감소"
                              className="inline-flex h-8 w-8 items-center justify-center text-zinc-700 hover:bg-stone-100 cursor-pointer"
                            >
                              <Minus className="h-3 w-3" aria-hidden="true" />
                            </button>
                            <span className="w-7 text-center text-xs font-medium tabular-nums text-zinc-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.key, 1)}
                              aria-label="수량 증가"
                              className="inline-flex h-8 w-8 items-center justify-center text-zinc-700 hover:bg-stone-100 cursor-pointer"
                            >
                              <Plus className="h-3 w-3" aria-hidden="true" />
                            </button>
                          </div>

                          <span className="text-sm font-semibold tabular-nums text-zinc-950">
                            {formatKRW(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-stone-200 bg-stone-50/70 px-6 py-5">
                <p className="text-xs text-zinc-600">
                  {remainingForFreeShipping > 0
                    ? `${formatKRW(remainingForFreeShipping)} 더 담으시면 무료배송이 적용됩니다.`
                    : '무료배송 조건이 적용되었습니다.'}
                </p>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-zinc-600">
                    <dt>상품 금액</dt>
                    <dd className="tabular-nums">{formatKRW(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <dt>배송비</dt>
                    <dd className="tabular-nums">
                      {shippingFee === 0 ? '무료' : formatKRW(shippingFee)}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-semibold text-zinc-950">
                    <dt>총 결제 금액</dt>
                    <dd className="tabular-nums">{formatKRW(total)}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="mt-5 min-h-[46px] w-full rounded-md bg-[#1f3a3d] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#162b2d] cursor-pointer"
                >
                  주문하기
                </button>
              </div>
            )}
          </>
        )}

        {step === 'checkout' && (
          <form
            onSubmit={handleCheckoutSubmit}
            className="flex flex-1 flex-col overflow-y-auto"
          >
            <div className="flex-1 space-y-4 px-6 py-5">
              <div>
                <label
                  htmlFor="checkout-name"
                  className="block text-xs font-medium text-zinc-700"
                >
                  수령인 이름
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="김서연"
                  className="mt-1.5 min-h-[42px] w-full rounded-md border border-stone-300 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#1f3a3d] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-phone"
                  className="block text-xs font-medium text-zinc-700"
                >
                  연락처
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="010-1234-5678"
                  className="mt-1.5 min-h-[42px] w-full rounded-md border border-stone-300 bg-white px-3.5 py-2 text-sm tabular-nums text-zinc-900 placeholder:text-zinc-400 focus:border-[#1f3a3d] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-medium text-zinc-700"
                >
                  배송지 주소
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="서울시 성동구 연무장길 48, 301호"
                  className="mt-1.5 min-h-[42px] w-full rounded-md border border-stone-300 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#1f3a3d] focus:outline-none"
                />
              </div>

              <fieldset>
                <legend className="text-xs font-medium text-zinc-700">
                  결제 수단
                </legend>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(['신용카드', '계좌이체', '착불 결제'] as const).map(
                    (method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`min-h-[40px] rounded-md border px-2 py-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                          paymentMethod === method
                            ? 'border-[#1f3a3d] bg-[#1f3a3d] text-white'
                            : 'border-stone-300 bg-white text-zinc-700 hover:border-zinc-500'
                        }`}
                      >
                        {method}
                      </button>
                    ),
                  )}
                </div>
              </fieldset>

              {formError && (
                <p role="alert" className="text-xs font-medium text-red-700">
                  {formError}
                </p>
              )}
            </div>

            <div className="border-t border-stone-200 bg-stone-50/70 px-6 py-5">
              <div className="flex items-center justify-between text-sm font-semibold text-zinc-950">
                <span>최종 결제 금액 ({totalItemCount}개)</span>
                <span className="tabular-nums">{formatKRW(total)}</span>
              </div>

              <div className="mt-4 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setFormError('');
                    setStep('cart');
                  }}
                  className="min-h-[44px] rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 whitespace-nowrap hover:bg-stone-100 cursor-pointer"
                >
                  이전
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] flex-1 rounded-md bg-[#1f3a3d] px-5 py-2.5 text-sm font-medium text-white whitespace-nowrap transition-colors hover:bg-[#162b2d] cursor-pointer"
                >
                  {formatKRW(total)} 주문 완료
                </button>
              </div>
            </div>
          </form>
        )}

        {step === 'complete' && completedOrder && (
          <div className="flex flex-1 flex-col justify-between px-6 py-8">
            <div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1f3a3d]/10 text-[#1f3a3d]">
                <Check className="h-5 w-5" aria-hidden="true" />
              </div>

              <h3 className="font-display mt-4 text-xl font-medium text-zinc-950">
                주문이 정상적으로 접수되었습니다
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                주문번호{' '}
                <strong className="font-semibold tabular-nums text-zinc-950">
                  #{completedOrder.orderNumber}
                </strong>{' '}
                — 상품 검수 및 배송 준비가 시작되었습니다.
              </p>

              <dl className="mt-6 space-y-3 border-y border-stone-200 py-5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500">수령인</dt>
                  <dd className="font-medium text-zinc-900">
                    {completedOrder.customerName}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500">배송지</dt>
                  <dd className="text-right font-medium text-zinc-900">
                    {completedOrder.address}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500">결제 수단</dt>
                  <dd className="font-medium text-zinc-900">
                    {completedOrder.paymentMethod}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500">결제 금액</dt>
                  <dd className="font-semibold tabular-nums text-zinc-950">
                    {formatKRW(completedOrder.totalAmount)} ({completedOrder.itemCount}개)
                  </dd>
                </div>
              </dl>
            </div>

            <button
              type="button"
              onClick={handleCloseDrawer}
              className="min-h-[46px] w-full rounded-md bg-[#1f3a3d] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#162b2d] cursor-pointer"
            >
              쇼핑 계속하기
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
