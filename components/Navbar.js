import React, { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { DataContext } from "../store/GlobalState";
import Cookies from "js-cookie";

const Navbar = () => {
  const router = useRouter();

  const { state, dispatch } = useContext(DataContext);

  const { auth, cart } = state;

  const isActive = (r) => {
    if (r === router.pathname) {
      return " active";
    } else {
      return "";
    }
  };

  const handleLogout = () => {
    Cookies.remove("refreshtoken", { path: "api/auth/accessToken" });
    localStorage.removeItem("firstLogin");
    dispatch({ type: "AUTH", payload: {} });
    dispatch({ type: "NOTIFY", payload: { success: "Logged out!" } });
  };
  const loggedRouter = () => {
    return (
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <img
            src={auth.user.avatar}
            alt={auth.user.avatar}
            style={{
              borderRadius: "50%",
              width: "25px",
              height: "25px",
              transform: "translateY(-3px)",
              marginRight: "3px",
            }}
          />
          {auth.user.name}
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          <Link href="/profile">
            <a className="dropdown-item">Hồ sơ</a>
          </Link>

          <button className="dropdown-item" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </li>
    );
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">Dming</a>
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className="collapse navbar-collapse justify-content-end"
        id="navbarSupportedContent"
      >
        <ul className="navbar-nav">
          <li className={"nav-item" + isActive("/cart")}>
            <Link href="/cart">
              <a className="nav-link">
                <i
                  className="fas fa-shopping-cart position-relative"
                  aria-hidden="true"
                >
                  <span
                    className="position-absolute"
                    style={{
                      padding: "3px 6px",
                      background: "#ed143dc2",
                      borderRadius: "50%",
                      top: "-10px",
                      right: "-10px",
                      color: "white",
                      fontSize: "14px",
                    }}
                  >
                    {cart.length}
                  </span>
                </i>
              </a>
            </Link>
          </li>
          {Object.keys(auth).length === 0 ? (
            <li className={"nav-item" + isActive("/signin")}>
              <Link href="/signin">
                <a className="nav-link">
                  <i className="fas fa-user" aria-hidden="true"></i>
                  Sign in
                </a>
              </Link>
            </li>
          ) : (
            loggedRouter()
          )}
        </ul>
        {/* <form className="form-inline my-2 my-lg-0">
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            type="submit"
          >
            Search
          </button>
        </form> */}
      </div>
    </nav>
  );
};

export default Navbar;
