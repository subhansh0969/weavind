import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function ProductCard({ product, index = 0 }) {
  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const hasSecondImage = product.images && product.images.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
    >
      <Link to={`/product/${product._id}`} className="group block">
        <div className="relative aspect-[3/4] bg-ink/5 rounded-sm overflow-hidden mb-3">
          {product.images && product.images.length > 0 ? (
            <>
              <img
                src={product.images[0]}
                alt={product.name}
                className={
                  hasSecondImage
                    ? 'w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0'
                    : 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                }
              />
              {hasSecondImage && (
                <img
                  src={product.images[1]}
                  alt={product.name + ' alternate view'}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink/30 font-display text-sm">
              No Image
            </div>
          )}
          <div className="absolute top-3 left-3 bg-bone/90 px-2 py-1 text-[10px] uppercase tracking-wider font-display text-ink/70">
            {product.category}
          </div>
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-madder text-white px-2 py-1 text-[10px] uppercase tracking-wider font-display rounded-sm">
              {discountPercent}% OFF
            </div>
          )}
        </div>
        {product.productType && (
          <p className="font-display text-[11px] uppercase tracking-wide text-ink/40 mb-1">
            {product.productType}
          </p>
        )}
        <h3 className="font-body text-lg text-ink leading-snug group-hover:text-indigo transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <p className="font-display text-sm text-ink">₹{product.price}</p>
          {hasDiscount && (
            <p className="font-display text-xs text-ink/40 line-through">₹{product.mrp}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;