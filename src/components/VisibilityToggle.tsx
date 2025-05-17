'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface VisibilityToggleProps {
  children: React.ReactNode;
  initialVisibility?: boolean;
  className?: string;
}

export default function VisibilityToggle({ 
  children, 
  initialVisibility = false,
  className = ''
}: VisibilityToggleProps) {
  const [isVisible, setIsVisible] = useState(initialVisibility);
  const { t } = useTranslation();

  return (
    <div className={className}>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
      >
        {isVisible ? t('common.hide') : t('common.show')}
      </button>
      {isVisible && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
} 