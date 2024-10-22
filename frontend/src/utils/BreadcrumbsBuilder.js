import { FaCar, FaUserCircle, FaUserCog, FaUserShield } from 'react-icons/fa';
import { HiHome } from 'react-icons/hi';
import { MdChecklist } from 'react-icons/md';
import { PiStackPlusFill } from 'react-icons/pi';
import { LuPenSquare } from 'react-icons/lu';
import { BiCategory } from 'react-icons/bi';

const BreadcrumbsBuilder = (path) => {
  const breadcrumbs = [
    {
      label: 'Home',
      href: '/',
      icon: HiHome,
    },
    {
      label: 'Competencias',
      href: '/contest',
      icon: FaCar,
    },
    {
      label: 'Crear Competencia',
      href: '/contest/create',
      icon: PiStackPlusFill,
    },
    {
      label: 'Editar Competencia',
      href: '/contest/edit',
      icon: LuPenSquare,
    },
    {
      label: 'Puntajes',
      href: '/scores',
      icon: FaCar,
    },
    {
      label: 'Nuevo puntaje',
      href: '/scores/create',
      icon: PiStackPlusFill,
    },
    {
      label: 'Editar puntaje',
      href: '/scores/edit',
      icon: LuPenSquare,
    },
    {
      label: 'Catalogos',
      href: '/catalogs',
      icon: BiCategory,
    },
    {
      label: 'Usuarios',
      href: '/users',
      icon: FaUserCircle,
    },
    {
      label: 'Crear Usuario',
      href: '/users/create',
      icon: null,
    },
    {
      label: 'Editar Usuario',
      href: '/users/edit',
      icon: null,
    },
    {
      label: 'Detalles del Usuario',
      href: '/users/view',
      icon: null,
    },
    {
      label: 'Configuracion de la Cuenta',
      href: '/account-settings',
      icon: FaUserCog,
    },
    {
      label: 'Control de roles',
      href: '/roles',
      icon: FaUserShield,
    },
  ];

  const pathArray = path.split('/').filter((item) => item);

  const newPathArray = pathArray.map((item, index) => {
    return pathArray.slice(0, index + 1).join('/');
  });

  let breadcrumb = [];

  newPathArray.forEach((item) => {
    const found = breadcrumbs.find(
      (breadcrumb) => breadcrumb.href === `/${item}`,
    );
    if (found) {
      breadcrumb.push(found);
    }
  });

  return breadcrumb;
};

export default BreadcrumbsBuilder;
