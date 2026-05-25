import { useState } from 'react';
import type { Product } from '../types/product';
import { ShoppingBagIcon } from './icons/ShoppingIcons';

interface ProductCardProps {
  product: Product;
  cartQuantity: number;
  onAddToCart: (product: Product) => void;
}

const priceFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'USD',
});

export default function ProductCard({
  product,
  cartQuantity,
  onAddToCart,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const inStock = product.stock > 0;
  const atMaxInCart = cartQuantity >= product.stock;

  const buttonLabel = !inStock
    ? 'Sin stock'
    : atMaxInCart
      ? 'Máximo en carrito'
      : cartQuantity > 0
        ? `Agregar (${cartQuantity})`
        : 'Agregar al carrito';

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        {!imageError && product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="product-card__image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="product-card__image-fallback" aria-hidden="true">
            Sin imagen
          </div>
        )}
        {cartQuantity > 0 && (
          <span className="product-card__cart-badge" title="En tu carrito">
            <ShoppingBagIcon size={14} />
            {cartQuantity}
          </span>
        )}
      </div>
      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h2 className="product-card__name">{product.name}</h2>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__meta">
          <span className="product-card__price">
            {priceFormatter.format(product.price)}
          </span>
          <span
            className={`product-card__stock ${inStock ? 'product-card__stock--available' : 'product-card__stock--out'}`}
          >
            {inStock ? `${product.stock} disponibles` : 'Agotado'}
          </span>
        </div>
        <button
          type="button"
          className="product-card__add-btn"
          onClick={() => onAddToCart(product)}
          disabled={!inStock || atMaxInCart}
          aria-label={`${buttonLabel}: ${product.name}`}
        >
          <ShoppingBagIcon size={18} className="product-card__add-icon" />
          <span>{buttonLabel}</span>
        </button>
      </div>
    </article>
  );
}
