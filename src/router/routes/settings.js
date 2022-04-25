export default [
  {
    path: '/parametres/utilisateurs',
    name: 'utilisateurs',
    component: () => import('@/views/settings/utilisateurs'),
    meta: {
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
    // eslint-disable-next-line import/no-unresolved
    component: () => import('@/views/settings/salaries'),
    meta: {
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
    path: '/parametres/roles_permission',
    name: 'roles_permission',
    component: () => import('@/views/settings/roles&permissions'),
    meta: {
      pageTitle: 'Paramétres',
      breadcrumb: [
        {
          text: 'Roles & Permissions',
          active: true,
        },
      ],
    },
  },
]
