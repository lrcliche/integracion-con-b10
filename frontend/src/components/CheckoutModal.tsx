import { useState } from 'react';
import type { CartItem } from '../types/cart';
import {
  simulateCheckout,
  type CheckoutForm,
  type CheckoutResult,
} from '../services/checkoutService';
import { CheckCircleIcon, CreditCardIcon } from './icons/ShoppingIcons';

interface CheckoutModalProps {
  items: CartItem[];
  total: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: CheckoutResult) => void;
}

const priceFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'USD',
});

type Step = 'form' | 'processing' | 'success';

export default function CheckoutModal({
  items,
  total,
  isOpen,
  onClose,
  onSuccess,
}: CheckoutModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState<CheckoutForm>({ name: '', email: '' });
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckoutResult | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    if (step === 'processing') return;
    setStep('form');
    setForm({ name: '', email: '' });
    setError(null);
    setResult(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStep('processing');

    try {
      const checkoutResult = await simulateCheckout(items, form);
      setResult(checkoutResult);
      setStep('success');
      onSuccess(checkoutResult);
    } catch (err) {
      setStep('form');
      setError(err instanceof Error ? err.message : 'No se pudo completar la compra');
    }
  };

  return (
    <div className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
      <div className="checkout-modal__backdrop" onClick={handleClose} />
      <div className="checkout-modal__content">
        {step === 'form' && (
          <>
            <div className="checkout-modal__header">
              <CreditCardIcon size={22} className="checkout-modal__header-icon" />
              <h2 id="checkout-title">Simular compra</h2>
              <button
                type="button"
                className="checkout-modal__close"
                onClick={handleClose}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <p className="checkout-modal__note">
              Esta es una simulación académica. No se realizará ningún cargo real.
            </p>
            <ul className="checkout-modal__summary">
              {items.map(({ product, quantity }) => (
                <li key={product.id}>
                  <span>
                    {product.name} × {quantity}
                  </span>
                  <span>{priceFormatter.format(product.price * quantity)}</span>
                </li>
              ))}
            </ul>
            <p className="checkout-modal__total">
              Total a pagar: <strong>{priceFormatter.format(total)}</strong>
            </p>
            <form className="checkout-modal__form" onSubmit={handleSubmit}>
              <label>
                Nombre completo
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Tu nombre"
                  required
                />
              </label>
              <label>
                Correo electrónico
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </label>
              {error && (
                <p className="checkout-modal__error" role="alert">
                  {error}
                </p>
              )}
              <div className="checkout-modal__actions">
                <button type="button" className="btn btn--ghost" onClick={handleClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn--primary">
                  Confirmar compra simulada
                </button>
              </div>
            </form>
          </>
        )}

        {step === 'processing' && (
          <div className="checkout-modal__processing">
            <div className="spinner" aria-hidden="true" />
            <p>Procesando tu pedido…</p>
            <span className="checkout-modal__processing-hint">Simulación de pasarela de pago</span>
          </div>
        )}

        {step === 'success' && result && (
          <div className="checkout-modal__success">
            <CheckCircleIcon size={48} className="checkout-modal__success-icon" />
            <h2>¡Compra simulada exitosa!</h2>
            <p className="checkout-modal__order-id">
              Pedido: <strong>{result.orderId}</strong>
            </p>
            <p>
              {result.itemCount} {result.itemCount === 1 ? 'artículo' : 'artículos'} ·{' '}
              {priceFormatter.format(result.total)}
            </p>
            <p className="checkout-modal__success-email">
              Confirmación enviada a <strong>{form.email}</strong> (simulado)
            </p>
            <button type="button" className="btn btn--primary" onClick={handleClose}>
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
