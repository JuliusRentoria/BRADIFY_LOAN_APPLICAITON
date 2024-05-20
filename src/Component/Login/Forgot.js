import { Link } from "react-router-dom";

const Login = () => {

  return (
    <div className="login template d-flex justify-content-center align-items-center 100-w vh-100 bg-primary">
        <div className="form_container p-5 rounded bg-white">
          <form>
              <h3 className="text-center">Forgot Password</h3>
              <div className="mb-2">
                <label htmlFor="email">Please enter your email</label>
                <input type="email" placeholder="Email" className="form-control" />
              </div>
              <div className="d-grid">
                <button className="btn btn-primary">Submit</button>
              </div>
                <p className="text-right">
                  <Link to="/">Go Back</Link>
                </p>
          </form>
        </div>
    </div>
  )
}

export default Login;