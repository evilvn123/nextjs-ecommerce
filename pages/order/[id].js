import Head from "next/head";
import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../store/GlobalState";
import { useRouter } from "next/router";
import Link from "next/link";
import OrderDetail from "../../components/OrderDetail";

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
          <OrderDetail key={order._id} order={order} state={state} dispatch={dispatch} />
        ))}
      </div>
    </div>
  );
};

export default DetailOrder;
