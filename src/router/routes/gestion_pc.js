export default [
  {
    path: '/gestion_pc/ordinateurs/',
    name: 'ordinateurs',
    component: () => import('@/views/gestion_pc/ordinateurs'),
    meta: {
      resource: 'ordinateurs',
      pageTitle: 'Gestion PC',
      breadcrumb: [
        {
          text: 'Mes Ordinateurs ',
          active: true,
        },
      ],
    },
  },
  {
    path: '/gestion_pc/affectations_pc/',
    name: 'affectations_pc',
    component: () => import('@/views/gestion_pc/affectations_pc'),
    meta: {
      resource: 'affectations_pc',
      pageTitle: 'Gestion PC',
      breadcrumb: [
        {
          text: 'Affectation PC',
          active: true,
        },
      ],
    },
  },
  {
    path: '/gestion_pc/historique_affectations/',
    name: 'historique_pc',
    component: () => import('@/views/gestion_pc/historique_pc'),
    meta: {
      resource: 'historique_pc',
      pageTitle: 'Gestion PC',
      breadcrumb: [
        {
          text: "Historique d'Affectation PCs",
          active: true,
        },
      ],
    },
  },
  {
    path: '/print-page',
    name: 'print-page',
    component: () => import('@/views/gestion_pc/print/index'),
    meta: {
      layout: 'full',
    },
  },
]
