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
        payload: { error: "File kh??ng t???n t???i." },
      });
    }
    if (file.size > 1024 * 1024) {
      return dispatch({
        type: "NOTIFY",
        payload: { error: "K??ch th?????c l???n nh???t l?? 1MB." },
      });
    }
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      return dispatch({
        type: "NOTIFY",
        payload: { error: "???nh kh??ng ????ng ?????nh d???ng." },
      });
    }

    setData({ ...data, avatar: file });
  };
  return (
    <>
      {!!auth.user && (
        <div className="profile_page">
          <Head>
            <title>H??? s?? </title>
          </Head>
          <section className="row text-secondary">
            <div className="col-md-4">
              <h3 className="text-uppercase">
                {auth.user.role === "user" ? "Ng?????i d??ng" : "Admin"}
              </h3>
              <div className="avatar">
                <img
                  src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
                  alt="avatar"
                />
                <span>
                  <i className="fas fa-camera"></i>
                  <p>Thay ?????i</p>
                  <input
                    type="file"
                    name="file"
                    id="file_up"
                    onChange={changeAvatar}
                  />
                </span>
              </div>
              <div className="form-group">
                <label htmlFor="name">T??n</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  className="form-control"
                  placeholder="T??n c???a b???n"
                  onChange={onChangeInput}
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">?????a ch??? Email</label>
                <input
                  type="text"
                  name="email"
                  defaultValue={auth.user.email}
                  className="form-control"
                  disabled
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">M???t kh???u</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  className="form-control"
                  placeholder="M???t kh???u c???a b???n"
                  onChange={onChangeInput}
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">X??c nh???n m???t kh???u</label>
                <input
                  type="password"
                  name="cf_password"
                  value={cf_password}
                  className="form-control"
                  placeholder="X??c nh???n m???t kh???u"
                  onChange={onChangeInput}
                />
              </div>
              <button
                className="btn btn-info"
                disabled={notify.loading}
                onClick={handleUpdateProfile}
              >
                C???p nh???t
              </button>
            </div>
            <div className="col-md-8 table-responsive">
              <h3 className="text-uppercase">????n h??ng</h3>
              <div className="my-3">
                <table
                  className="table-bordered table-hover w-100 text-uppercase"
                  style={{ minWidth: "600px" }}
                >
                  <thead className="bg-light font-weight-bold">
                    <tr>
                      <td className="p-2">id</td>
                      <td className="p-2">ng??y t???o</td>
                      <td className="p-2">t???ng</td>
                      <td className="p-2">tr???ng th??i giao h??ng</td>
                      <td className="p-2">Thao t??c</td>
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
                            <a>chi ti???t</a>
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
