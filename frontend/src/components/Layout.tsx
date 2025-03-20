import React, { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-flapp-lightBg flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>
      <footer className="bg-flapp-dark text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Flapp E-Commerce. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;