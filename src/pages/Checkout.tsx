import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks';
import { useAuth } from '../hooks';
import { Button, Card, CardBody, CardHeader, Input } from '../components/shared';
import { formatCurrency } from '../utils/currencies';
import { api } from '../services/api';
import { getDashboardRouteForRole } from '../utils/auth';

declare global {
  interface Window {
    Razorpay?: new (options: any) => {
      open: () => void;
      on: (event: string, callback: (response: any) => void) => void;
    };
  }
}

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const paymentMode = api.payment.getMode();
  const isSimulationMode = paymentMode === 'simulate';
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    name: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    zipCode: '',
  });
  const [step, setStep] = useState<'billing' | 'payment'>('billing');

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Redirect if cart is empty
  if (cart.totalItems === 0) {
    navigate('/cart');
    return null;
  }

  const handleBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const launchRazorpayCheckout = async () => {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      throw new Error('VITE_RAZORPAY_KEY_ID is missing for razorpay mode');
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Unable to load Razorpay checkout script');
    }

    const orderResponse = await api.payment.createOrder(cart.totalPrice, cart.items);
    if (!orderResponse.success || !orderResponse.order?.id) {
      throw new Error(orderResponse.error || 'Unable to create Razorpay order');
    }

    await new Promise<void>((resolve, reject) => {
      const RazorpayCheckout = window.Razorpay;
      if (!RazorpayCheckout) {
        reject(new Error('Razorpay checkout is unavailable'));
        return;
      }

      const checkout = new RazorpayCheckout({
        key: razorpayKey,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency || 'INR',
        order_id: orderResponse.order.id,
        name: 'Coursiva',
        description: 'Course enrollment payment',
        prefill: {
          name: billingInfo.name,
          email: billingInfo.email,
          contact: billingInfo.phone,
        },
        theme: { color: '#6A6CFF' },
        modal: {
          ondismiss: () => resolve(),
        },
        handler: async (response: any) => {
          try {
            const verifyResponse = await api.payment.verify({
              ...response,
              amount: cart.totalPrice,
              items: cart.items,
            });

            if (!verifyResponse.success) {
              reject(new Error(verifyResponse.error || 'Payment verification failed'));
              return;
            }

            clearCart();
            navigate(getDashboardRouteForRole(user?.role), { replace: true });
            resolve();
          } catch (error) {
            reject(error);
          }
        },
      });

      checkout.on('payment.failed', (response: any) => {
        const description = response?.error?.description || response?.error?.reason;
        reject(new Error(description || 'Payment failed'));
      });

      checkout.open();
    });
  };

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);

    try {
      if (isSimulationMode) {
        const res = await api.payment.simulate(cart.totalPrice, cart.items);

        if (res.success) {
          clearCart();
          navigate(getDashboardRouteForRole(user?.role), { replace: true });
        } else {
          alert(res.error || 'Payment failed');
        }
      } else {
        await launchRazorpayCheckout();
      }
    } catch (e) {
      console.error('Payment initiation failed:', e);
      alert(e instanceof Error ? e.message : 'Failed to initiate payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToBilling = () => {
    setStep('billing');
  };

  if (step === 'billing') {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <div className="checkout-content">
          <div className="checkout-form">
            <Card>
              <CardHeader>
                <h2>Billing Information</h2>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleBillingSubmit}>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <Input
                      label="Full Name"
                      value={billingInfo.name}
                      onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={billingInfo.email}
                      onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                      required
                    />
                    <Input
                      label="Phone"
                      value={billingInfo.phone}
                      onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                      required
                    />
                    <Input
                      label="Address"
                      value={billingInfo.address}
                      onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                      required
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <Input
                        label="City"
                        value={billingInfo.city}
                        onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                        required
                      />
                      <Input
                        label="ZIP Code"
                        value={billingInfo.zipCode}
                        onChange={(e) => setBillingInfo({ ...billingInfo, zipCode: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button variant="primary" type="submit" style={{ width: '100%', marginTop: '1.5rem' }}>
                    Continue to Payment
                  </Button>
                </form>
              </CardBody>
            </Card>
          </div>

          <div className="order-summary">
            <Card shadow="md">
              <CardHeader>
                <h3>Order Summary</h3>
              </CardHeader>
              <CardBody>
                {cart.items.map((item) => (
                  <div key={item.courseId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>{item.course.title} (x{item.quantity})</span>
                    <span>{formatCurrency(item.course.price * item.quantity)}</span>
                  </div>
                ))}
                <hr style={{ margin: '1rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <span>Total</span>
                  <span style={{ color: '#FF464A' }}>{formatCurrency(cart.totalPrice)}</span>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="checkout-page">
        <h1>Payment Information</h1>
        <div className="checkout-content">
          <div className="checkout-form">
            <Card>
              <CardHeader>
                <h2>Review & Pay</h2>
              </CardHeader>
              <CardBody>
                <div className="flex flex-col gap-6 text-center py-8">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {isSimulationMode ? 'Simulated Payment Gateway' : 'Razorpay Secure Checkout'}
                    </h3>
                    <p className="text-base-content/70 mt-2">
                      {isSimulationMode
                        ? 'This is a mock transaction environment. Your payment will be simulated, and course access will be granted instantly without any real charges.'
                        : 'Real payment mode is active. You will be redirected to Razorpay checkout, and enrollment will be granted only after signature verification.'}
                    </p>
                  </div>
                  
                  <div className="flex justify-center gap-4 mt-4">
                    <Button variant="outline" onClick={handleBackToBilling}>
                      Go Back
                    </Button>
                    <Button variant="primary" onClick={handlePaymentSubmit} disabled={isProcessing} className="px-8 shadow-lg">
                      {isProcessing ? (
                        <span className="loading loading-spinner"></span>
                      ) : isSimulationMode ? (
                        `Simulate Payment of ${formatCurrency(cart.totalPrice)}`
                      ) : (
                        `Pay ${formatCurrency(cart.totalPrice)} with Razorpay`
                      )}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="order-summary">
            <Card shadow="md">
              <CardHeader>
                <h3>Order Summary</h3>
              </CardHeader>
              <CardBody>
                {cart.items.map((item) => (
                  <div key={item.courseId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>{item.course.title} (x{item.quantity})</span>
                    <span>{formatCurrency(item.course.price * item.quantity)}</span>
                  </div>
                ))}
                <hr style={{ margin: '1rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <span>Total</span>
                  <span style={{ color: '#FF464A' }}>{formatCurrency(cart.totalPrice)}</span>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
