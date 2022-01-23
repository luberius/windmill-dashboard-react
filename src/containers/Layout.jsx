import React, { useContext, Suspense, useEffect, lazy } from 'react';
import { Switch, Route, Redirect, useLocation, useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import routes from '../routes';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Main from './Main';
import ThemedSuspense from '../components/ThemedSuspense';
import { SidebarContext } from '../context/SidebarContext';
import { checkLogin } from '../utils/auth/auth';
import http from '../utils/axios/axios';

const Page404 = lazy(() => import('../pages/404'));

function Layout() {
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (!checkLogin()) history.push('/login');
    http.defaults.headers.Authorization = `Bearer ${Cookies.get('token')}`;
  }, []);

  useEffect(() => {
    closeSidebar();
  }, [location]);

  return (
    <div
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isSidebarOpen && 'overflow-hidden'}`}>
      <Sidebar />

      <div className="flex flex-col flex-1 w-full">
        <Header />
        <Main>
          <Suspense fallback={<ThemedSuspense />}>
            <Switch>
              {routes.map((route, i) => {
                return route.component ? (
                  <Route
                    key={i}
                    exact
                    path={`/app${route.path}`}
                    render={(props) => <route.component {...props} />}
                  />
                ) : null;
              })}
              <Redirect exact from="/app" to="/app/dashboard" />
              <Route component={Page404} />
            </Switch>
          </Suspense>
        </Main>
      </div>
    </div>
  );
}

export default Layout;
