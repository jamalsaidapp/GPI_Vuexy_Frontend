export default [
  {
    path: '/parametres/utilisateurs',
    name: 'utilisateurs',
    component: () => import('@/views/settings/utilisateurs'),
    meta: {
      resource: 'users',
      action: 'read',
      pageTitle: 'Paramétres',
      breadcrumb: [
        {
          text: 'Utilisateurs',
          active: true,
        },
      ],
    },
  },
  {
    path: '/parametres/salaries',
    name: 'salaries',
    component: () => import('@/views/settings/salaries'),
    meta: {
      resource: 'salaries',
      action: 'read',
      pageTitle: 'Paramétres',
      breadcrumb: [
        {
          text: 'Salaries',
          active: true,
        },
      ],
    },
  },
  {
    path: '/parametres/roles_permissions',
    name: 'roles_permissions',
    component: () => import('@/views/settings/roles&permissions'),
    meta: {
      resource: ['roles', 'permissions'],
      action: 'read',
      pageTitle: 'Paramétres',
      breadcrumb: [
        {
          text: 'Roles & Permissions',
          active: true,
        },
      ],
    },
  },
  {
    path: '/parametres/projets',
    name: 'projets',
    component: () => import('@/views/settings/projets'),
    meta: {
      resource: 'projets',
      action: 'read',
      pageTitle: 'Projets',
      breadcrumb: [
        {
          text: 'Projets',
          active: true,
        },
      ],
    },
  },
]
