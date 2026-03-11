import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader } from '../components/shared';

export default function OrderConfirmation() {
  // In a real app, this would come from URL params or state
  const orderId = 'ORD-' + Date.now();
  const orderDate = new Date().toLocaleDateString();

  return (
    <div className="order-confirmation-page" style={{ textAlign: 'center', padding: '3rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ color: '#2B2162', marginBottom: '0.5rem' }}>Order Confirmed!</h1>
        <p style={{ color: '#6C6C6C', fontSize: '1.1rem', marginBottom: '2rem' }}>
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        <Card shadow="md" style={{ marginBottom: '2rem' }}>
          <CardHeader>
            <h2 style={{ margin: 0 }}>Order Details</h2>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'grid', gap: '1rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Order ID:</span>
                <strong>{orderId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Order Date:</span>
                <strong>{orderDate}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Status:</span>
                <strong style={{ color: '#28a745' }}>Confirmed</strong>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card shadow="sm" style={{ marginBottom: '2rem' }}>
          <CardBody>
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>What's Next?</h3>
            <div style={{ textAlign: 'left', display: 'grid', gap: '0.5rem' }}>
              <p>📧 <strong>Email Confirmation:</strong> Check your email for order details</p>
              <p>🎓 <strong>Course Access:</strong> Your courses will be available in your dashboard</p>
              <p>💬 <strong>Support:</strong> Contact us if you have any questions</p>
            </div>
          </CardBody>
        </Card>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/dashboard" className="flex-1">
                <Button variant="primary" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
              <Link to="/courses" className="flex-1">
                <Button variant="outline" className="w-full">
                  Browse More Courses
                </Button>
              </Link>
        </div>
      </div>
    </div>
  );
}
