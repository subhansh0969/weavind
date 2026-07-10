function Skeleton({ className = '' }) {
  return (
    <div
      className={
        'animate-pulse bg-gradient-to-r from-ink/5 via-ink/10 to-ink/5 bg-[length:200%_100%] rounded-sm ' +
        className
      }
      style={{ animation: 'shimmer 1.5s ease-in-out infinite' }}
    />
  );
}

export default Skeleton;