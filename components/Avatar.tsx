export default function Avatar({ mode, size = "md" }: { mode: "Leeloo" | "Shanti"; size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? 32 : size === "lg" ? 96 : 64;

  if (mode === "Leeloo") {
    return (
      <svg width={dim} height={dim} viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" fill="#1a0000" stroke="#dc1a1a" strokeWidth="2" />
        <circle cx="22" cy="26" r="4" fill="#dc1a1a" />
        <circle cx="42" cy="26" r="4" fill="#dc1a1a" />
        <path d="M20 42 Q32 52 44 42" stroke="#dc1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="20" y="10" width="24" height="6" rx="3" fill="#dc1a1a" opacity="0.3" />
      </svg>
    );
  }

  return (
    <svg width={dim} height={dim} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill="#001a00" stroke="#22c55e" strokeWidth="2" />
      <circle cx="22" cy="26" r="4" fill="#22c55e" />
      <circle cx="42" cy="26" r="4" fill="#22c55e" />
      <path d="M20 40 Q32 50 44 40" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="12" r="6" fill="#22c55e" opacity="0.2" />
    </svg>
  );
}
