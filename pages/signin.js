import Head from "next/head";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../store/GlobalState";
import Cookies from "js-cookie";
import { postData } from "../utils/fetchData";
import { useRouter } from "next/router";

const Signin = () => {
  const initialState = {
    email: "",
    password: "",
  };
  const [userData, setUserData] = useState(initialState);
  const { email, password } = userData;

  const { state, dispatch } = useContext(DataContext);

  const { auth } = state;
  const router = useRouter();

  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push("/");
  }, [auth]);
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData((userData) => ({ ...userData, [name]: value }));
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await postData("auth/login", userData);
    if (res.err)
      return dispatch({ type: "NOTIFY", payload: { error: res.err } });

    dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    dispatch({
      type: "AUTH",
      payload: { token: res.access_token, user: res.user },
    });

    Cookies.set("refreshtoken", res.refresh_token, {
      path: "api/path/accessToken",
      expires: 7,
    });

    localStorage.setItem("firstLogin", true);
  };
  return (
    <div>
      <Head>
        <title>Đăng nhập</title>
      </Head>
      <form
        className="mx-auto my-4"
        style={{ maxWidth: "500px" }}
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label className="font-weight-bold" htmlFor="exampleInputEmail1">Địa chỉ Email</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="email"
            value={email}
            onChange={handleChangeInput}
          />
          <small id="emailHelp" className="form-text text-muted">
            Thông tin của bạn sẽ được giữ kín.
          </small>
        </div>
        <div className="form-group">
          <label className="font-weight-bold" htmlFor="exampleInputPassword1">Mật khẩu</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            value={password}
            onChange={handleChangeInput}
          />
        </div>
        <button type="submit" className="btn btn-info w-100">
          Đăng nhâp
        </button>
        <p className="my-2">
          Chưa có tài khoản?
          <Link href="/register">
            <a style={{ color: "crimson" }}> Đăng ký</a>
          </Link>
        </p>
      </form>
    </div>
  );
};
export default Signin;
