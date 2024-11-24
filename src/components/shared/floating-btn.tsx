'use client';
import { ChevronUp } from 'lucide-react';
import React, { useEffect } from 'react';
import { Button } from '../ui/button';

const FloatingButton = () => {
  const isBrowser = () => typeof window !== 'undefined';

  if (!isBrowser()) {
    return null;
  }

  const handleClickTopButton = () => {
    if (isBrowser()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Button
      className="fixed bottom-4 right-4 z-50 h-9"
      variant="outline"
      onClick={handleClickTopButton}
    >
      <ChevronUp />
    </Button>
  );
};

export default FloatingButton;
