export default [
  {
    title: 'Gestion PC',
    icon: 'MonitorIcon',
    children: [
      {
        title: 'List des PCs',
        route: 'ordinateurs',
        resource: 'ordinateurs',
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
        resource: 'historique_pc',
        action: 'read',
      },
    ],
  },
]
