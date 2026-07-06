function getStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: 'Weak', color: 'bg-madder', width: '25%' };
  if (score <= 3) return { label: 'Medium', color: 'bg-gold', width: '60%' };
  return { label: 'Strong', color: 'bg-indigo', width: '100%' };
}

function PasswordStrength({ password }) {
  if (!password) return null;

  const strength = getStrength(password);

  return (
    <div className="mt-2">
      <div className="h-1.5 w-full bg-ink/10 rounded-full overflow-hidden">
        <div
          className={'h-full rounded-full transition-all duration-300 ' + strength.color}
          style={{ width: strength.width }}
        />
      </div>
      <p className="font-display text-xs text-ink/50 mt-1">
        Password strength: <span className="text-ink/70">{strength.label}</span>
      </p>
      {strength.label === 'Weak' && (
        <p className="font-display text-xs text-ink/40 mt-1">
          Tip: Use 8+ characters with a number, uppercase letter, and symbol.
        </p>
      )}
    </div>
  );
}

export default PasswordStrength;