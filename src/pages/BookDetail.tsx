import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { SplitText } from '../components/animations/SplitText';

const CATEGORY_EMOJIS: Record<string, string> = {
  programming: '💻',
  design: '🎨',
  business: '💼',
  science: '🔬',
  math: '📐',
  language: '🌍',
};

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const res = await fetch(`/api/v1/books/${id}`);
      const data = await res.json();
      if (data.success) {
        setBook(data.data);
      } else {
        setError(data.error || 'Book not found');
      }
    } catch (err) {
      setError('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  if (error || !book) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">📕</div>
        <h2 className="text-3xl font-bold mb-2">Book Not Found</h2>
        <p className="text-base-content/60 mb-6">{error || 'This book could not be loaded.'}</p>
        <Link to="/books" className="btn btn-primary">← Back to Books</Link>
      </div>
    </div>
  );

  const handleAddToCart = () => {
    addToCart({
      id: book._id,
      subjectId: 'book',
      category: book.category,
      title: book.title,
      rating: 5,
      price: book.price,
      image: book.image,
      description: book.description,
    } as unknown as any);
  };

  const categoryColorMap: Record<string, string> = {
    programming: 'badge-primary',
    design: 'badge-accent',
    business: 'badge-info',
    science: 'badge-success',
    math: 'badge-warning',
    language: 'badge-secondary',
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Breadcrumb */}
      <div className="bg-base-200 border-b border-base-300 py-3 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="breadcrumbs text-sm">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/books">Books</Link></li>
              <li className="font-semibold">{book.title}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Book Cover Display */}
          <div className="flex justify-center">
            <div className="relative group">
              <div 
                className="w-72 h-[420px] rounded-r-2xl rounded-l-md shadow-2xl flex flex-col items-center justify-center text-center p-8 relative overflow-hidden bg-base-300 border-l-[12px] border-primary/80 group-hover:-translate-y-2 transition-transform duration-500"
              >
                <div className="text-8xl mb-6 shadow-sm drop-shadow-xl group-hover:scale-110 transition-transform duration-500">{CATEGORY_EMOJIS[book.category] || '📚'}</div>
                <div className="font-extrabold text-2xl leading-tight text-base-content">{book.title}</div>
                <div className="text-base-content/60 text-sm mt-3 font-semibold tracking-widest uppercase">{book.author}</div>
                {/* Book spine effect */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-black/10 flex items-center justify-center">
                  <span className="text-base-content/30 text-[10px] font-bold rotate-90 whitespace-nowrap tracking-[0.3em]">COURSIVA PUBLISHING</span>
                </div>
              </div>
              {/* Shadow effect */}
              <div className="absolute -right-6 top-6 w-72 h-[420px] bg-base-content/10 rounded-2xl -z-10 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            </div>
          </div>

          {/* Book Info */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`badge ${categoryColorMap[book.category] || 'badge-neutral'} badge-lg`}>
                {CATEGORY_EMOJIS[book.category]} {book.category.toUpperCase()}
              </span>
              {book.stock <= 5 && book.stock > 0 && (
                <span className="badge badge-error badge-lg animate-pulse">🔥 Only {book.stock} left!</span>
              )}
              {book.stock === 0 && (
                <span className="badge badge-error badge-lg">Out of Stock</span>
              )}
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-2 text-base-content tracking-tight">
              <SplitText text={book.title} delay={30} className="inline-block" />
            </h1>
            <p className="text-xl text-base-content/60 mb-6 font-medium">by <span className="text-primary font-bold">{book.author}</span></p>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="rating rating-md">
                {[1,2,3,4,5].map(star => (
                  <input key={star} type="radio" name="rating-1" className="mask mask-star-2 bg-warning" checked={star === 5} readOnly />
                ))}
              </div>
              <span className="text-base-content/60 text-sm">(4.8 · 1,234 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-extrabold text-primary">${book.price}</span>
              <span className="text-xl text-base-content/40 line-through">${(book.price * 1.3).toFixed(2)}</span>
              <div className="badge badge-success text-white">25% OFF</div>
            </div>

            {/* Description */}
            <div className="prose max-w-none mb-8">
              <h3 className="text-lg font-bold mb-2">About This Book</h3>
              <p className="text-base-content/70 leading-relaxed">{book.description}</p>
            </div>

            {/* Quantity + Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="join">
                <button 
                  className="btn btn-outline join-item btn-sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >−</button>
                <span className="btn btn-sm join-item pointer-events-none">{quantity}</span>
                <button 
                  className="btn btn-outline join-item btn-sm"
                  onClick={() => setQuantity(Math.min(book.stock || 99, quantity + 1))}
                >+</button>
              </div>
              <span className="text-sm text-base-content/50">{book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {isInCart(book._id) ? (
                <Link to="/cart" className="flex-1">
                  <button className="btn btn-success btn-lg w-full gap-2">
                    🛒 View in Cart
                  </button>
                </Link>
              ) : (
                <button
                  className="btn btn-primary btn-lg flex-1 gap-2"
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                >
                  🛒 Add to Cart
                </button>
              )}
              <button className="btn btn-outline btn-lg gap-2">
                ♡ Wishlist
              </button>
            </div>

            {/* Trust badges */}
            <div className="divider my-6"></div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-2xl">🚚</div>
                <div className="text-xs text-base-content/60 mt-1">Free Delivery</div>
              </div>
              <div>
                <div className="text-2xl">↩️</div>
                <div className="text-xs text-base-content/60 mt-1">Easy Returns</div>
              </div>
              <div>
                <div className="text-2xl">🔒</div>
                <div className="text-xs text-base-content/60 mt-1">Secure Payment</div>
              </div>
            </div>
          </div>
        </div>

        {/* You might also like section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-2">📖 About the Author</h2>
          <div className="divider mb-6"></div>
          <div className="card bg-base-200 shadow">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-16">
                    <span className="text-2xl">✍️</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{book.author}</h3>
                  <p className="text-base-content/60">Expert Author · Bestseller</p>
                </div>
              </div>
              <p className="text-base-content/70 mt-4">
                {book.author} is a renowned expert in the field of {book.category}, known for their ability to explain complex concepts in clear, accessible language. Their works have helped thousands of readers worldwide advance their skills and careers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
