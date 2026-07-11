import Skeleton from './Skeleton';

function PageLoader() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <Skeleton className="h-4 w-40 mb-8" />
      <Skeleton className="h-10 w-2/3 mb-6" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

export default PageLoader;