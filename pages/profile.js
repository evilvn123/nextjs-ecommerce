import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../store/GlobalState";
import { patchData } from "../utils/fetchData";
import { imageUpload } from "../utils/imageUpload";
import valid from "../utils/valid";
import Link from "next/link";

const Profile = () => {
  const initialState = {
    avatar: "",
    name: "",
    password: "",
    cf_password: "",
  };

  const [data, setData] = useState(initialState);
  const { avatar, name, password, cf_password } = data;

  const { state, dispatch } = useContext(DataContext);
  const { auth, notify, orders } = state;

  useEffect(() => {
    !!auth.user && setData({ ...data, name: auth.user.name });
  }, [auth.user]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setData((data) => ({ ...data, [name]: value }));
    dispatch({ type: "NOTIFY", payload: {} });
  };
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (password) {
      const errMsg = valid(name, auth.user.email, password, cf_password);
      if (errMsg)
        return dispatch({ type: "NOTIFY", payload: { error: errMsg } });
      updatePassword();
    }

    if (name != auth.user.name || avatar) updateInfor();
  };

  const updatePassword = () => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    patchData("/user/resetPassword", { password }, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  const updateInfor = async () => {
    let media;
    dispatch({ type: "NOTIFY", payload: { loading: true } });

    if (avatar) media = await imageUpload([avatar]);

    patchData(
      "user",
      {
        name,
        avatar: avatar ? media[0].url : auth.user.avatar,
      },
      auth.token
    ).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch({
        type: "AUTH",
        payload: {
          token: auth.token,
          user: res.user,
        },
      });
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  const changeAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return dispatch({
        type: "NOTIFY",
        payload: { error: "File does not exist." },
      });
    }
    if (file.size > 1024 * 1024) {
      return dispatch({
        type: "NOTIFY",
        payload: { error: "The largest image size is 1MB." },
      });
    }
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Image format is incorrect." },
      });
    }

    setData({ ...data, avatar: file });
  };
  return (
    <>
      {!!auth.user && (
        <div className="profile_page">
          <Head>
            <title>Hồ sơ </title>
          </Head>
          <section className="row text-secondary">
            <div className="col-md-4">
              <h3 className="text-uppercase">
                {auth.user.role === "user" ? "Người dùng" : "Admin"}
              </h3>
              <div className="avatar">
                <img
                  src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
                  alt="avatar"
                />
                <span>
                  <i className="fas fa-camera"></i>
                  <p>Thay đổi</p>
                  <input
                    type="file"
                    name="file"
                    id="file_up"
                    onChange={changeAvatar}
                  />
                </span>
              </div>
              <div className="form-group">
                <label htmlFor="name">Tên</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  className="form-control"
                  placeholder="Tên của bạn"
                  onChange={onChangeInput}
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Địa chỉ Email</label>
                <input
                  type="text"
                  name="email"
                  defaultValue={auth.user.email}
                  className="form-control"
                  disabled
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  className="form-control"
                  placeholder="Mật khẩu của bạn"
                  onChange={onChangeInput}
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  name="cf_password"
                  value={cf_password}
                  className="form-control"
                  placeholder="Xác nhận mật khẩu"
                  onChange={onChangeInput}
                />
              </div>
              <button
                className="btn btn-info"
                disabled={notify.loading}
                onClick={handleUpdateProfile}
              >
                Cập nhật
              </button>
            </div>
            <div className="col-md-8 table-responsive">
              <h3 className="text-uppercase">Đơn hàng</h3>
              <div className="my-3">
                <table
                  className="table-bordered table-hover w-100 text-uppercase"
                  style={{ minWidth: "600px" }}
                >
                  <thead className="bg-light font-weight-bold">
                    <tr>
                      <td className="p-2">id</td>
                      <td className="p-2">ngày tạo</td>
                      <td className="p-2">tổng</td>
                      <td className="p-2">trạng thái giao hàng</td>
                      <td className="p-2">Thao tác</td>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="p-2">{order._id}</td>
                        <td className="p-2">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-2">${order.total}</td>
                        <td className="p-2">
                          {order.delivered ? (
                            <i className="fas fa-check text-success"></i>
                          ) : (
                            <i className="fas fa-times text-danger"></i>
                          )}
                        </td>
                        <td className="p-2">
                          <Link href={`/order/${order._id}`}>
                            <a>chi tiết</a>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};
export default Profile;
