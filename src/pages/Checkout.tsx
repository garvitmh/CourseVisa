import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks';
import { useAuth } from '../hooks';
import { Button, Card, CardBody, CardHeader, Input } from '../components/shared';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
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

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);

    try {
      const token = localStorage.getItem('auth_token');
      // Create order
      const orderRes = await fetch('/api/v1/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: cart.totalPrice })
      });
      const orderData = await orderRes.json();

      if (!orderData.success) throw new Error('Order creation failed');

      // If mock, skip real razorpay popover
      if (orderData.mock) {
        alert('Mock Razorpay Payment Successful (No keys provided)');
        clearCart();
        navigate('/order-confirmation');
        return;
      }

      const options = {
        key: 'YOUR_RAZORPAY_KEY_HERE', // This should ideally come from env, but mock will work without it.
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Coursiva E-Learning",
        description: "Course Enrollment",
        order_id: orderData.order.id,
        handler: async function (response: any) {
          // Verify
          const verifyRes = await fetch('/api/v1/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            clearCart();
            navigate('/order-confirmation');
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: billingInfo.name,
          email: billingInfo.email,
          contact: billingInfo.phone,
        },
        theme: {
          color: "#a855f7"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(response.error.description);
      });
      rzp.open();
    } catch (e) {
      console.error(e);
      alert('Failed to initiate payment');
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
                    <span>₹{item.course.price * item.quantity}</span>
                  </div>
                ))}
                <hr style={{ margin: '1rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <span>Total</span>
                  <span style={{ color: '#FF464A' }}>₹{cart.totalPrice}</span>
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
                    <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Pay Securely with Razorpay</h3>
                    <p className="text-base-content/70 mt-2">You will be securely redirected to complete your payment via UPI, Credit Card, or Net Banking.</p>
                  </div>
                  
                  <div className="flex justify-center gap-4 mt-4">
                    <Button variant="outline" onClick={handleBackToBilling}>
                      Go Back
                    </Button>
                    <Button variant="primary" onClick={handlePaymentSubmit} disabled={isProcessing} className="px-8 shadow-lg">
                      {isProcessing ? <span className="loading loading-spinner"></span> : `Pay ₹${cart.totalPrice}`}
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
                    <span>₹{item.course.price * item.quantity}</span>
                  </div>
                ))}
                <hr style={{ margin: '1rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <span>Total</span>
                  <span style={{ color: '#FF464A' }}>₹{cart.totalPrice}</span>
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
