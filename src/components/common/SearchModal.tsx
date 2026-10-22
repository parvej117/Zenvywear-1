import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.fabricDetails.kameezFabric.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
    : [];

  const popularSearches = ['Black Three Piece', 'Emerald', 'Jamdani Saree', 'Organza', 'Kurti', 'Velvet'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div className="relative w-full max-w-2xl bg-[#121212] border border-[#D4AF66]/40 rounded-2xl shadow-2xl p-6 space-y-6">
        
        {/* Search Input Bar */}
        <div className="flex items-center space-x-3 pb-3 border-b border-neutral-800">
          <Search className="w-5 h-5 text-[#D4AF66] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search luxury three-pieces, sarees, fabrics, colors..."
            className="w-full bg-transparent text-sm text-white placeholder-neutral-500 outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-neutral-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="text-xs text-neutral-400 hover:text-white uppercase tracking-wider pl-2">
            Close
          </button>
        </div>

        {/* Popular Tags */}
        {!query && (
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block">
              Popular Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1.5 rounded-full bg-[#181818] border border-neutral-800 text-xs text-neutral-300 hover:border-[#D4AF66] hover:text-[#D4AF66] transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {query && (
          <div className="space-y-3">
            <div className="text-xs text-neutral-400">
              Found <strong className="text-[#D4AF66]">{results.length}</strong> matching silhouettes:
            </div>

            {results.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                No items found matching "{query}". Try searching for "Three Piece" or "Silk".
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#181818] hover:bg-[#202020] border border-neutral-800/80 hover:border-[#D4AF66]/40 cursor-pointer transition group"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images[0]}
                        alt=""
                        className="w-12 h-14 object-cover object-top rounded-lg bg-black border border-neutral-800 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-semibold text-white group-hover:text-[#D4AF66] transition">
                          {product.name}
                        </h4>
                        <span className="text-[11px] text-neutral-400 block">
                          {product.category} • {product.fabricDetails.kameezFabric}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-[#D4AF66] block">
                        ৳{product.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-emerald-400">In Stock</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
