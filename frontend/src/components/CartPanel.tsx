import { useState } from 'react';
import type { CartItem } from '../types/cart';
import CheckoutModal from './CheckoutModal';
import { ShoppingCartIcon } from './icons/ShoppingIcons';

interface CartPanelProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onCheckoutSuccess: () => void;
}

const priceFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'USD',
});

export default function CartPanel({
  items,
  isOpen,
  onClose,
  onRemove,
  onUpdateQuantity,
  onCheckoutSuccess,
}: CartPanelProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutSuccess = () => {
    onCheckoutSuccess();
    setCheckoutOpen(false);
    onClose();
  };

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? 'cart-overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside
        className={`cart-panel ${isOpen ? 'cart-panel--open' : ''}`}
        aria-label="Carrito de compras"
        aria-hidden={!isOpen}
      >
        <div className="cart-panel__header">
          <h2>
            <ShoppingCartIcon size={20} className="cart-panel__title-icon" />
            Tu carrito
          </h2>
          <button
            type="button"
            className="cart-panel__close"
            onClick={onClose}
            aria-label="Cerrar carrito"
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-panel__empty">
            <ShoppingCartIcon size={40} className="cart-panel__empty-icon" />
            <p>Aún no has agregado productos.</p>
          </div>
        ) : (
          <>
            <ul className="cart-panel__list">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="cart-item">
                  <div className="cart-item__thumb">
                    {product.image_url ? (
                      <img src={product.image_url} alt="" />
                    ) : (
                      <ShoppingCartIcon size={18} />
                    )}
                  </div>
                  <div className="cart-item__content">
                    <div className="cart-item__info">
                      <span className="cart-item__name">{product.name}</span>
                      <span className="cart-item__price">
                        {priceFormatter.format(product.price * quantity)}
                      </span>
                    </div>
                    <div className="cart-item__actions">
                      <div className="cart-item__qty">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(product.id, quantity - 1)
                          }
                          aria-label={`Reducir cantidad de ${product.name}`}
                        >
                          −
                        </button>
                        <span>{quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(
                              product.id,
                              Math.min(quantity + 1, product.stock),
                            )
                          }
                          disabled={quantity >= product.stock}
                          aria-label={`Aumentar cantidad de ${product.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="cart-item__remove"
                        onClick={() => onRemove(product.id)}
                        aria-label={`Quitar ${product.name} del carrito`}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-panel__footer">
              <p className="cart-panel__summary">
                {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
              </p>
              <p className="cart-panel__total">
                Total: <strong>{priceFormatter.format(total)}</strong>
              </p>
              <button
                type="button"
                className="btn btn--primary btn--block"
                onClick={() => setCheckoutOpen(true)}
              >
                <ShoppingCartIcon size={18} />
                Simular compra
              </button>
            </div>
          </>
        )}
      </aside>

      <CheckoutModal
        items={items}
        total={total}
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />
    </>
  );
}
