import type { CartItem } from '../types/cart';

export interface CheckoutForm {
  name: string;
  email: string;
}

export interface CheckoutResult {
  orderId: string;
  total: number;
  itemCount: number;
  processedAt: string;
}

function generateOrderId(): string {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DEV-${Date.now().toString(36).toUpperCase()}-${suffix}`;
}

export async function simulateCheckout(
  items: CartItem[],
  form: CheckoutForm,
): Promise<CheckoutResult> {
  if (items.length === 0) {
    throw new Error('El carrito está vacío');
  }

  if (!form.name.trim() || !form.email.trim()) {
    throw new Error('Completa nombre y correo');
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(form.email.trim())) {
    throw new Error('Correo electrónico inválido');
  }

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  await new Promise((resolve) => setTimeout(resolve, 1800));

  if (Math.random() < 0.02) {
    throw new Error('Error simulado de pasarela. Intenta de nuevo.');
  }

  return {
    orderId: generateOrderId(),
    total,
    itemCount,
    processedAt: new Date().toISOString(),
  };
}
