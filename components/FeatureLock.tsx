import React from 'react';

interface FeatureLockProps {
  children: React.ReactNode;
  isEnabled: boolean;
  featureName: string;
}

export default function FeatureLock({ children, isEnabled, featureName }: FeatureLockProps) {
  if (isEnabled) return <>{children}</>;

  return (
    <div className="relative group overflow-hidden rounded-xl">
      {/* Konten yang diburamkan */}
      <div className="opacity-20 grayscale pointer-events-none filter blur-[1px]">
        {children}
      </div>
      
      {/* Overlay Under Development */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 border border-dashed border-yellow-600 rounded-xl">
        <span className="text-[10px] font-bold text-yellow-500 tracking-widest uppercase bg-black px-2 py-1 rounded">
          {featureName} - Under Development[cite: 1]
        </span>
        <span className="text-xl mt-1">🚧</span>
      </div>
    </div>
  );
}