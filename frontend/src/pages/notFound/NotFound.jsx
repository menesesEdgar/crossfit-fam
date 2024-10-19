import React from 'react';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import { FaHome } from 'react-icons/fa';

export const NotFound = () => {
  return (
    <div className="w-full h-full">
      <section className="bg-white dark:bg-gray-900 h-full">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-orange-500 dark:text-primary-500">
              404
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
              Pagina no encontrada
            </p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              Lo sentimos, la página que buscas no existe o no está disponible.
            </p>
            <p className="mb-8 text-sm font-light text-gray-500 dark:text-gray-400">
              Por favor, verifica la URL o vuelve al inicio. Si el problema
              persiste, contacta a soporte.
            </p>
            <div className="mb-8 flex justify-center w-full">
              <ActionButtons
                extraActions={[
                  {
                    label: 'Volver al inicio',
                    href: '/',
                    color: 'mycad',
                    icon: FaHome,
                    filled: true,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
