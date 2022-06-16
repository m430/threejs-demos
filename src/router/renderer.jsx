import { Routes, Route, Outlet } from 'react-router-dom';
import { useParams, useLocation } from 'react-router-dom';
import loadable from '@loadable/component';

const withRouter = (Comp) => (props) => {
  const params = useParams();
  const location = useLocation();
  const match = { params };

  return (
    <Comp
      {...props}
      match={match}
      location={location}
    />
  );
}

function renderRoute(route, index, props) {
  const routes = renderChildren(route?.routes, props);

  let { component, name, ...rest } = route;
  const newProps = {
    ...props,
    route,
  }
  let el = <Outlet {...newProps} />;
  if (component) {
    let Component = loadable(() => import(`../${component}.jsx`), {
      fallback: <div>Loading...</div>
    });
    Component = withRouter(Component);
    el = <Component {...newProps} ><Outlet /></Component>
  }
  return (
    <Route
      key={`${name}-${index}`}
      element={el}
      {...rest}>
      {routes}
    </Route>
  )
}

function renderChildren(routes = [], props) {
  return routes.map((route, index) => renderRoute(route, index, props));
}

export const renderRoutes = ({ routes, props }) => {
  if (!routes) {
    return null;
  }
  return <Routes>{renderChildren(routes, props)}</Routes>;
}