function TrustBadges() {
  const badges = [
    { label: '7 Day Returns', icon: 'return' },
    { label: 'Free Shipping', icon: 'shipping' },
    { label: 'Secure Payments', icon: 'secure' },
    { label: 'Made in India', icon: 'india' },
  ];

  const icons = {
    return: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
      </svg>
    ),
    shipping: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    secure: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    india: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
  };

  return (
    <div className="border-y border-ink/10 bg-ink/[0.02]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center md:justify-between gap-x-8 gap-y-3">
        {badges.map((badge) => (
          <div key={badge.label} className="flex items-center gap-2 text-ink/60">
            {icons[badge.icon]}
            <span className="font-display text-xs uppercase tracking-wide">
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrustBadges;