import routes from "../router/router.config";
import { Link } from "react-router-dom";
import "./index.css";

function Layout({ children }) {

  const renderLink = (items = [], parentPath) => {
    return items.map((item, index) => {
      let node = (
        <li key={index}>
          <Link to={`${parentPath}${item.path}`}>{item?.name || item?.path}</Link>
        </li>
      )
      if (item?.routes?.length > 0) {
        let links = renderLink(item.routes, `${parentPath ? parentPath : ""}${item.path != "/" ? item.path : ""}/`);
        node = (
          <li key={index}>
            {item?.path}
            <ul>{links}</ul>
          </li>
        )
      }
      return node;
    })
  }

  return (
    <div className="layout">
      <div style={{ width: 300 }}>
        <ul>
          {renderLink(routes)}
        </ul>
      </div>
      <div className="model">{children}</div>
    </div>
  )
}

export default Layout;