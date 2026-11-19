import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CATEGORIES,
  PRODUCTS,
  type Product,
  type ProductCategory,
} from './data/products';
import { useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer, type CartItem } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { BrandStory } from './components/BrandStory';
import { Footer } from './components/Footer';
import { AuthPage } from './pages/AuthPage';

export default function App() {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const [pathname, setPathname] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/',
  );
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>('전체');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      key: `${PRODUCTS[0].id}::${PRODUCTS[0].options[0]}`,
      product: PRODUCTS[0],
      option: PRODUCTS[0].options[0],
      quantity: 1,
    },
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const prevAuthRef = useRef<boolean | null>(null);

  const navigateHome = useCallback(() => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setPathname('/');
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (prevAuthRef.current === null) {
      prevAuthRef.current = isAuthenticated;
      return;
    }
    if (prevAuthRef.current !== isAuthenticated) {
      if (isAuthenticated) {
        const name = profile?.full_name ? `${profile.full_name}님, ` : '';
        showToast(`${name}Google 계정으로 로그인되었습니다.`);
      } else {
        showToast('로그아웃되었습니다.');
      }
      prevAuthRef.current = isAuthenticated;
    }
  }, [isAuthenticated, isLoading, profile?.full_name, showToast]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === '전체') return PRODUCTS;
    return PRODUCTS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const totalCartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const handleAddToCart = (
    product: Product,
    option: string,
    quantity: number,
  ) => {
    const key = `${product.id}::${option}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { key, product, option, quantity }];
    });
    showToast(`‘${product.name}’을(를) 장바구니에 담았습니다.`);
  };

  const handleQuickAdd = (product: Product) => {
    handleAddToCart(product, product.options[0] ?? '기본', 1);
  };

  const handleUpdateQuantity = (key: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveItem = (key: string) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleNavigateCategory = (category: ProductCategory) => {
    setSelectedCategory(category);
  };

  if (pathname === '/auth') {
    return <AuthPage onNavigateHome={navigateHome} />;
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] text-zinc-900">
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onNavigateCategory={handleNavigateCategory}
      />

      <main>
        <Hero />

        <section
          id="collection"
          aria-labelledby="collection-heading"
          className="border-t border-stone-200 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500">
                  추천 셀렉션 · 총{' '}
                  <span className="tabular-nums">{filteredProducts.length}</span>
                  점
                </p>
                <h2
                  id="collection-heading"
                  className="font-display mt-2 text-2xl font-medium tracking-tight text-zinc-950 sm:text-3xl"
                >
                  주요 컬렉션
                </h2>
              </div>

              <div
                role="tablist"
                aria-label="카테고리 필터"
                className="inline-flex w-fit items-center gap-1 rounded-lg bg-stone-200/75 p-1"
              >
                {CATEGORIES.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedCategory(category)}
                      className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-white text-zinc-950 shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-950'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={setActiveProduct}
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </div>
          </div>
        </section>

        <BrandStory />
      </main>

      <Footer onNavigateCategory={handleNavigateCategory} />

      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 bottom-5 z-40 flex items-center gap-4 rounded-lg bg-zinc-900 px-4 py-3 text-xs font-medium text-white shadow-lg sm:right-6"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setIsCartOpen(true);
            }}
            className="text-stone-300 underline underline-offset-4 whitespace-nowrap hover:text-white cursor-pointer"
          >
            장바구니 보기
          </button>
        </div>
      )}
    </div>
  );
}
