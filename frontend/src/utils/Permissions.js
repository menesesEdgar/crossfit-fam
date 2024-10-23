export const PermissionsByGroup = {
  athletes: {
    name: 'Atletas',
    permissions: [
      'view_athletes',
      'create_athletes',
      ,
      'edit_athletes',
      'delete_athletes',
    ],
  },
  contest: {
    name: 'Competencias',
    permissions: [
      'view_contest',
      'create_contest',
      'edit_contest',
      'delete_contest',
    ],
  },
  wods: {
    name: 'WODS',
    permissions: [
      'view_wods',
      'create_wods',
      'edit_wods',
      'delete_wods',
    ],
  },
  categories: {
    name: 'Categorías',
    permissions: [
      'view_categories',
      'create_category',
      'edit_category',
      'delete_category',
    ],
  },
  scores: {
    name: 'Puntajes',
    permissions: [
      'view_scores',
      'create_score',
      'edit_score',
      'delete_score',
    ],
  },
  users: {
    name: 'Usuarios',
    permissions: ['view_users', 'create_users', , 'edit_users', 'delete_users'],
  },
  roles: {
    name: 'Roles',
    permissions: ['view_roles', 'create_roles', 'edit_roles', 'delete_roles'],
  },
  account: {
    name: 'Configuracion de la cuenta',
    permissions: [
      'view_account',
      'edit_account',
      'change_password',
      'change_account_image',
    ],
  },
  dashboard: {
    name: 'Dashboard',
    permissions: ['view_dashboard'],
  },
};
