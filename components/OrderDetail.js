import Link from "next/link";
import { updateItem } from "../store/Action";
import { patchData } from "../utils/fetchData";

const OrderDetail = ({ order, state, dispatch }) => {
  const { auth, orders } = state;
  const handleDelivered = (id) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    patchData(`order/delivered/${id}`, null, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch(updateItem(orders, id, { ...order, delivered: res.delivered }, "ADD_ORDERS"));
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  return (
    <div className="text-uppercase my-3">
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
          {order.delivered ? `Giao vào ${order.updatedAt}` : "Chưa giao"}
          {auth.user.role === "admin" && !order.delivered && (
            <button
              className="btn btn-info text-uppercase"
              onClick={() => handleDelivered(order._id)}
            >
              Đánh dấu đã giao
            </button>
          )}
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
                {item.quantity} x ${item.price} = ${item.quantity * item.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default OrderDetail;
