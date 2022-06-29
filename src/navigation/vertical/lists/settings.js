export default [
  {
    title: 'Paramétres',
    icon: 'SettingsIcon',
    children: [
      {
        title: 'Utilisateurs',
        route: 'utilisateurs',
      },
      {
        title: 'Roles & Permissions',
        route: 'roles_permissions',
      },
      {
        title: 'Salaries',
        route: 'salaries',
        resource: 'salaries',
        action: 'read',
      },
      {
        title: 'Projets',
        route: 'projets',
        resource: 'projets',
        action: 'read',
      },
    ],
  },
]
