import { useLayoutEffect, useState } from 'react';
import { Router } from 'react-router-dom';
import { renderRoutes } from './renderer';
import { createBrowserHistory } from "history";
import routes from './router.config';

export const history = createBrowserHistory();

const CustomRouter = ({ history, ...props }) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location
  });

  useLayoutEffect(() => {
    history.listen(setState), [history]
  });

  return (
    <Router
      {...props}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
};

function RouterConfig(props) {
  return (
    <CustomRouter history={history}>
      {renderRoutes({ routes, props: { history } })}
    </CustomRouter>
  )
}

export default RouterConfig;  