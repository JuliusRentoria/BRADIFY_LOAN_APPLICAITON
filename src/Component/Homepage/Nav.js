import { Link } from "react-router-dom";

const Nav = () => {

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link to="/homepage" className="navbar-brand" href=" ">BRADIFY</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=" navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/homepage/application" className="nav-link active" aria-current="page" href=" ">Loan Application</Link>
            </li>
            <li className="nav-item">
              <Link to="/homepage/loan" className="nav-link active" aria-current="page"href=" ">Loan Form</Link>
            </li>
            <li className="nav-item">
              <Link to="/homepage/pending" className="nav-link active" aria-current="page" href=" ">Pending List</Link>
            </li>
            <li className="nav-item">
              <Link to ="/homepage/transaction" className="nav-link active" aria-current="page" href=" ">Transaction History</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Nav;