import { useState, useEffect } from 'react';

export default function useSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Логика Scroll Lock с компенсацией рывка
  useEffect(() => {
    if (isSidebarOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isSidebarOpen]);

  // Возвращаем стейт и функции наружу, чтобы их мог взять любой компонент
  return {
    isSidebarOpen,
    setIsSidebarOpen, // пригодится для принудительного закрытия
    openSidebar,
    closeSidebar
  };
}