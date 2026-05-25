import { useCallback, useEffect, useMemo, useState } from 'react';
import CartPanel from './components/CartPanel';
import ProductCard from './components/ProductCard';
import { ShoppingCartIcon } from './components/icons/ShoppingIcons';
import { fetchProducts } from './services/productService';
import type { CartItem } from './types/cart';
import type { Product } from './types/product';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const cartQuantities = useMemo(() => {
    const map = new Map<number, number>();
    for (const item of cart) {
      map.set(item.product.id, item.quantity);
    }
    return map;
  }, [cart]);

  const addToCart = useCallback((product: Product) => {
    if (product.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id !== productId) return item;
        const capped = Math.min(quantity, item.product.stock);
        return { ...item, quantity: capped };
      }),
    );
  }, []);

  const handleCheckoutSuccess = useCallback(() => {
    setCart([]);
    setToast('¡Compra simulada completada con éxito!');
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchProducts();
        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : 'No se pudo conectar con el backend';
          setError(message);
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="app">
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}

      <header className="header">
        <div className="header__inner">
          <div className="header__brand">
            <h1 className="header__title">Tienda DevStore CI</h1>
            <p className="header__subtitle">
              Elementos de desarrollo e informática
            </p>
          </div>
          <button
            type="button"
            className="header__cart-btn"
            onClick={() => setCartOpen(true)}
            aria-label={`Abrir carrito, ${cartCount} artículos`}
          >
            <ShoppingCartIcon size={20} className="header__cart-icon" />
            <span>Carrito</span>
            {cartCount > 0 && (
              <span className="header__cart-badge">{cartCount}</span>
            )}
          </button>
        </div>
      </header>

      <main className="main">
        {loading && (
          <div className="status status--loading" role="status">
            <div className="spinner" aria-hidden="true" />
            <p>Cargando productos…</p>
          </div>
        )}

        {!loading && error && (
          <div className="status status--error" role="alert">
            <h2>No se pudieron cargar los productos</h2>
            <p>{error}</p>
            <p className="status__hint">
              Verifica que el backend esté activo en el puerto 8080.
            </p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="status status--empty">
            <p>No hay productos disponibles.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <section className="products-grid" aria-label="Catálogo de productos">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                cartQuantity={cartQuantities.get(product.id) ?? 0}
                onAddToCart={addToCart}
              />
            ))}
          </section>
        )}
      </main>

      <footer className="footer">
        <p>Proyecto académico — Integración Continua Semana 3</p>
      </footer>

      <CartPanel
        items={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckoutSuccess={handleCheckoutSuccess}
      />
    </div>
  );
}
