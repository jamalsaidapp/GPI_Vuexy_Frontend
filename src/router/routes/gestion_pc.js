export default [
  {
    path: '/gestion_pc/laptops/',
    name: 'laptops',
    component: () => import('@/views/gestion_pc/laptops'),
    meta: {
      resource: 'laptops',
      pageTitle: 'Gestion PC',
      breadcrumb: [
        {
          text: 'Laptops ',
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
      resource: 'returns_pc',
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
    path: '/print-affectation',
    name: 'print-affectation',
    component: () => import('@/views/gestion_pc/affectations_pc/print/index'),
    meta: {
      resource: 'affectations_pc',
      action: 'print',
      layout: 'full',
    },
  },
  {
    path: '/print-retour',
    name: 'print-retour',
    component: () => import('@/views/gestion_pc/historique_pc/print/index'),
    meta: {
      resource: 'returns_pc',
      action: 'print',
      layout: 'full',
    },
  },
]
