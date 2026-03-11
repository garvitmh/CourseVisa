import { Link } from 'react-router-dom';
import { useCart } from '../hooks';
import { Card, CardBody } from '../components/shared/Card';
import { Button, Badge } from '../components/shared';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  if (cart.totalItems === 0) {
    return (
      <div className="cart-page" style={{ textAlign: 'center', padding: '3rem' }}>
        <h1>Shopping Cart</h1>
        <p style={{ color: '#6C6C6C', fontSize: '1.1rem' }}>Your cart is empty</p>
        <Link to="/courses" style={{ marginTop: '1rem', display: 'inline-block' }}>
          <Button variant="primary">Browse Courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <p>{cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''} in your cart</p>

      <div className="cart-content">
        <div className="cart-items">
          {cart.items.map((item) => (
            <Card key={item.courseId} shadow="sm">
              <CardBody>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img
                    src={item.course.image}
                    alt={item.course.title}
                    style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{item.course.title}</h3>
                    <p style={{ color: '#6C6C6C', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                      {item.course.subjectId} • {item.course.category}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Badge variant="success">★ {item.course.rating}</Badge>
                      <span style={{ fontWeight: 'bold', color: '#FF464A' }}>₹{item.course.price}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.courseId, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.courseId, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <p style={{ margin: '0', fontWeight: 'bold', color: '#FF464A' }}>
                      ₹{item.course.price * item.quantity}
                    </p>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item.courseId)}
                      style={{ marginTop: '0.5rem' }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="cart-summary">
          <Card shadow="md">
            <CardBody>
              <h3 style={{ marginTop: 0 }}>Order Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Subtotal ({cart.totalItems} items)</span>
                <span>₹{cart.totalPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 'bold' }}>
                <span>Total</span>
                <span style={{ color: '#FF464A', fontSize: '1.2rem' }}>₹{cart.totalPrice}</span>
              </div>
              <Link to="/checkout" className="w-full">
                <Button variant="primary" size="lg" style={{ width: '100%' }}>
                  Proceed to Checkout
                </Button>
              </Link>
              <Link to="/courses" className="w-full">
                <Button variant="outline" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Continue Shopping
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
