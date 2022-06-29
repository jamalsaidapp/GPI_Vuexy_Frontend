export default [
  {
    title: 'Gestion PC',
    icon: 'MonitorIcon',
    children: [
      {
        title: 'List des PCs',
        route: 'laptops',
        resource: 'laptops',
        action: 'read',
      },
      {
        title: 'Affectations PCs',
        route: 'affectations_pc',
        resource: 'affectations_pc',
        action: 'read',
      },
      {
        title: 'Historique des AFs',
        route: 'historique_pc',
        resource: 'returns_pc',
        action: 'read',
      },
    ],
  },
]
