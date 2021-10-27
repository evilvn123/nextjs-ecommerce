import Head from "next/head";
import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../store/GlobalState";
import { useRouter } from "next/router";
import Link from "next/link";
// import OrderDetail from '../../components/OrderDetail'

const DetailOrder = () => {
  const { state, dispatch } = useContext(DataContext);
  const { orders, auth } = state;

  const router = useRouter();

  const [orderDetail, setOrderDetail] = useState([]);

  useEffect(() => {
    const newArr = orders.filter((order) => order._id === router.query.id);
    setOrderDetail(newArr);
  }, [orders]);

  if (!auth.user) return null;
  return (
    <div className="my-3">
      <Head>
        <title>Chi tiết đơn hàng</title>
      </Head>

      <div>
        <button className="btn btn-dark" onClick={() => router.back()}>
          <i className="fas fa-long-arrow-alt-left" aria-hidden="true"></i> Go
          Quay lại
        </button>
      </div>
      <div style={{ maxWidth: "600px", margin: "20px auto" }}>
        {orderDetail.map((order) => (
          <div key={order._id} className="text-uppercase my-3">
            <h2 className="text-break">Đơn hàng {order._id}</h2>
            <div className="mt-4 text-secondary">
              <h4>Thông tin nhận hàng</h4>
              <p>Tên: {order.user.name}</p>
              <p>Email: {order.user.email}</p>
              <p>Địa chỉ: {order.address}</p>
              <p>Điện thoại: {order.mobile}</p>
              <div
                className={`alert ${
                  order.delivered ? "alert-success" : "alert-danger"
                } d-flex justify-content-between align-items-center`}
                role="alert"
              >
                {order.delivered
                  ? `Giao vào ${order.updateAt}`
                  : "Chưa giao"}
              </div>
              <div>
                <h4>Order Items</h4>
                {order.cart.map((item) => (
                  <div
                    key={item._id}
                    className="row border-bottom mx-0 p-2 justify-content-between align-items-center"
                    style={{ maxWidth: "550px" }}
                  >
                    <img
                      src={item.images[0].url}
                      alt={item.images[0].url}
                      style={{
                        width: "50px",
                        height: "45px",
                        objectFit: "cover",
                      }}
                    />
                    <h5 className="flex-fill text-secondary px-3 m-0">
                      <Link href={`/product/${item._id}`}>
                        <a>{item.title}</a>
                      </Link>
                    </h5>
                    <span className="text-info text-lowercase m-0">
                      {item.quantity} x ${item.price} ={" "}
                      ${item.quantity * item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <OrderDetail orderDetail={orderDetail} state={state} dispatch={dispatch} /> */}
    </div>
  );
};

export default DetailOrder;
