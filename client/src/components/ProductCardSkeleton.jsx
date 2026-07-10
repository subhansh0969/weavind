import Skeleton from './Skeleton';

function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[3/4] w-full mb-3" />
      <Skeleton className="h-3 w-16 mb-2" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

export default ProductCardSkeleton;