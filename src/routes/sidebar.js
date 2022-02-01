/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.jsx`
 */
const routes = [
  {
    path: '/app/dashboard', // the url
    icon: 'HomeIcon', // the component being exported from icons/index.jsx
    name: 'Dashboard' // name that appear in Sidebar
  },
  {
    path: '/app/input-data',
    icon: 'FormsIcon',
    name: 'Input Data'
  },
  // {
  //   path: '/app/cards',
  //   icon: 'CardsIcon',
  //   name: 'Cards'
  // },
  {
    path: '/app/reports/stock',
    icon: 'ChartsIcon',
    name: 'Report Stock'
  },
  {
    path: '/app/reports/expiry',
    icon: 'ExclamationIcon',
    name: 'Report Expiry'
  },
  // {
  //   path: '/app/buttons',
  //   icon: 'ButtonsIcon',
  //   name: 'Buttons'
  // },
  // {
  //   path: '/app/modals',
  //   icon: 'ModalsIcon',
  //   name: 'Modals'
  // },
  // {
  //   path: '/app/tables',
  //   icon: 'TablesIcon',
  //   name: 'Tables'
  // },
  {
    path: '/app/users',
    icon: 'PeopleIcon',
    name: 'Users'
  }
  /* {
    icon: 'PagesIcon',
    name: 'Pages',
    routes: [
      // submenu
      {
        path: '/login',
        name: 'Login'
      },
      {
        path: '/create-account',
        name: 'Create account'
      },
      {
        path: '/forgot-password',
        name: 'Forgot password'
      },
      {
        path: '/app/404',
        name: '404'
      },
      {
        path: '/app/blank',
        name: 'Blank'
      }
    ]
  } */
];

export default routes;
