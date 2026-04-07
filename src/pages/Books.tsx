import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../hooks/useCart';
import { SplitText } from '../components/animations/SplitText';
import { AnimatedList } from '../components/animations/AnimatedList';
import { formatCurrency } from '../utils/currencies';

import { BookOpen, Search, Laptop, Briefcase, Microscope, Calculator, Palette, Globe, Car } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  programming: 'badge-primary',
  business:    'badge-info',
  science:     'badge-success',
  math:        'badge-warning',
  design:      'badge-secondary',
  language:    'badge-accent',
};

const CATEGORY_ICONS: Record<string, any> = {
  programming: Laptop, business: Briefcase, science: Microscope,
  math: Calculator, design: Palette, language: Globe,
};

export default function Books() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const { addToCart, isInCart } = useCart();

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    try {
      const data = await api.books.getAll();
      if (data.success) setBooks(data.data);
    } catch (err) {
      console.error('Failed to fetch books', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(books.map(b => b.category)))];
  
  let filtered = selectedCategory === 'all' ? books : books.filter(b => b.category === selectedCategory);
  if (searchQuery) {
    filtered = filtered.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Reset to page 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Page Hero */}
      <div className="bg-base-200 py-16 px-4 border-b border-base-300 relative overflow-hidden">
        {/* Soft decorative blob */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="text-primary mb-4 animate-bounce flex justify-center"><BookOpen className="w-16 h-16"/></div>
          
          <h1 className="text-5xl lg:text-6xl font-extrabold text-base-content mb-4 tracking-tight">
            <SplitText text="Coursiva Library" delay={50} className="inline-block" />
          </h1>
          
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed font-medium">
            Curated textbooks and learning resources for every subject and level.
          </p>
        </div>
      </div>

      {/* Category Filter & Search */}
      <div className="bg-base-100 border-b border-base-200 py-6 px-4 sticky top-[68px] z-40 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto w-full">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-2 flex-nowrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm rounded-full transition-all duration-300 flex-shrink-0 ${
                  selectedCategory === cat 
                    ? 'btn-primary shadow-lg scale-105' 
                    : 'btn-ghost bg-base-200 border border-base-300 hover:border-primary'
                }`}
              >
                <span className="text-lg">
                  {(() => {
                    if (cat === 'all') return <BookOpen className="w-5 h-5"/>;
                    const Icon = CATEGORY_ICONS[cat];
                    return Icon ? <Icon className="w-5 h-5"/> : <BookOpen className="w-5 h-5"/>;
                  })()}
                </span>
                <span className="font-semibold capitalize">{cat === 'all' ? 'All Books' : cat}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="w-full md:w-auto relative">
           <input 
             type="text" 
             placeholder="Search books or authors..." 
             className="input input-bordered input-primary w-full md:w-80 shadow-sm rounded-full pl-10"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50"><Search className="w-5 h-5"/></span>
        </div>
      </div>

      {/* Books Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-base-content/60 font-medium">Loading library...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 bg-base-200 rounded-3xl border border-base-300 border-dashed">
            <div className="text-base-content/50 mb-4 flex justify-center"><Search className="w-16 h-16"/></div>
            <h3 className="text-2xl font-bold mb-2 text-base-content">No books found</h3>
            <button onClick={() => setSelectedCategory('all')} className="btn btn-primary mt-2">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-base-300">
              <h2 className="text-2xl font-extrabold text-base-content">
                Showing <span className="text-primary">{filtered.length}</span> book{filtered.length !== 1 ? 's' : ''}
              </h2>
            </div>

            <AnimatedList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentItems.map((book) => {
                const bookId = String(book.id || book._id);
                const badgeColor = CATEGORY_COLORS[book.category] || 'badge-neutral';
                const inCart = isInCart(bookId);
                return (
                  <div
                    key={bookId}
                    className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-base-300 group flex flex-col h-full"
                  >
                    {/* Book Cover */}
                    <div className="h-72 bg-base-200 relative flex flex-col items-center justify-center p-6 overflow-hidden">
                      <div className="absolute inset-0 bg-base-content opacity-5 mix-blend-overlay"></div>
                      {book.image && book.image !== 'no-photo.jpg' ? (
                        <img 
                          src={book.image} 
                          alt={book.title} 
                          className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 z-10 relative" 
                        />
                      ) : (
                        <>
                          <span className="text-primary z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-500">
                            {(() => { 
                              const Icon = CATEGORY_ICONS[book.category]; 
                              return Icon ? <Icon className="w-16 h-16"/> : <BookOpen className="w-16 h-16"/>; 
                            })()}
                          </span>
                          <span className="z-10 text-base-content/50 text-xs font-bold tracking-widest uppercase mt-4">
                            {book.category}
                          </span>
                        </>
                      )}
                      
                      {book.stock <= 5 && book.stock > 0 && (
                        <span className="absolute top-3 right-3 badge badge-error badge-sm font-bold shadow-sm animation-pulse">
                          Only {book.stock} left!
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="card-body p-6 flex flex-col flex-grow">
                      <span className={`badge ${badgeColor} badge-sm font-bold uppercase tracking-wider mb-2`}>
                        {book.category}
                      </span>
                      
                      <h3 className="card-title text-lg font-extrabold line-clamp-2 leading-tight text-base-content group-hover:text-primary transition-colors">
                        {book.title}
                      </h3>
                      
                      <p className="text-sm text-base-content/50 font-medium mb-2">
                        by {book.author}
                      </p>
                      
                      <p className="text-sm text-base-content/70 line-clamp-2 mb-4 flex-grow">
                        {book.description}
                      </p>

                      {/* Rating stars */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-warning text-sm tracking-widest">★★★★★</span>
                        <span className="text-xs text-base-content/50 font-semibold">(4.8)</span>
                      </div>

                      <div className="flex items-end justify-between mb-4 pt-4 border-t border-base-200">
                        <div>
                          <span className="text-2xl font-extrabold text-base-content block">{formatCurrency(book.price)}</span>
                          <span className="text-sm text-base-content/40 line-through font-medium block">
                            {formatCurrency(book.price * 1.3)}
                          </span>
                        </div>
                        <span className="text-success text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                          <Car className="w-4 h-4"/> Free Delivery
                        </span>
                      </div>

                      <div className="flex gap-2 w-full mt-auto">
                        <Link to={`/books/${bookId}`} className="flex-1">
                          <button className="btn btn-outline btn-primary w-full">
                            Details
                          </button>
                        </Link>
                        {inCart ? (
                          <Link to="/cart" className="flex-1">
                            <button className="btn btn-success w-full opacity-90">
                              In Cart ✓
                            </button>
                          </Link>
                        ) : (
                          <button
                            disabled={book.stock === 0}
                            onClick={() => addToCart({
                              id: bookId, subjectId: 'book', category: book.category,
                              title: book.title, rating: 5, price: book.price,
                              image: book.image, description: book.description,
                            } as any)}
                            className={`btn flex-1 ${book.stock === 0 ? 'btn-disabled' : 'btn-primary'}`}
                          >
                            {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </AnimatedList>
            <div className="flex justify-center mt-12 mb-8">
              <div className="join shadow-md">
                <button 
                  className="join-item btn" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                <button className="join-item btn no-animation bg-base-200">
                  Page {currentPage} of {totalPages}
                </button>
                <button 
                  className="join-item btn" 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
