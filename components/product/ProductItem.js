import Link from "next/link";
import { useContext } from "react";
import { addToCart } from "../../store/Action";
import { DataContext } from "../../store/GlobalState";

const ProductItem = ({ product, handleCheck }) => {
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth } = state;

  const userLink = () => {
    return (
      <>
        <button
          className="btn btn-success"
          style={{ marginLeft: "5px", flex: 1 }}
          disabled={product.inStock === 0}
          onClick={() => dispatch(addToCart(product, cart))}
        >
          Mua
        </button>
      </>
    );
  };

  const adminLink = () => {
    return (
      <>
        <Link href={`create/${product._id}`}>
          <a className="btn btn-info" style={{ marginRight: "5px", flex: 1 }}>
            Sửa
          </a>
        </Link>
        <button
          className="btn btn-danger"
          style={{ marginLeft: "5px", flex: 1 }}
          data-toggle="modal"
          data-target="#modal"
          onClick={() =>
            dispatch({
              type: "ADD_MODAL",
              payload: [
                {
                  data: "",
                  id: product._id,
                  title: product.title,
                  type: "DELETE_PRODUCT",
                },
              ],
            })
          }
        >
          Xoá
        </button>
      </>
    );
  };
  return (
    <div className="card" style={{ width: "18rem" }}>
      {auth.user && auth.user.role === "admin" && (
        <input
          type="checkbox"
          checked={product.checked}
          className="position-absolute"
          style={{ height: "20px", width: "20px" }}
          onChange={() => handleCheck(product._id)}
        />
      )}
      <Link href={`/product/${product._id}`}>
        <a style={{ textDecoration: "none", color: "inherit" }}>
          <img
            className="card-img-top"
            src={product.images[0].url}
            alt="Card image cap"
          />
        </a>
      </Link>
      <div className="card-body">
        <h5 className="card-title text-capitalize" title={product.title}>
          {product.title}
        </h5>
        <div className="row justify-content-between mx-0">
          <h6 className="text-danger">${product.price}</h6>
          {product.inStock > 0 ? (
            <h6 className="text-danger">Trong kho: {product.inStock}</h6>
          ) : (
            <h6 className="text-danger">Hết hàng</h6>
          )}
        </div>
        <p className="card-text" title={product.description}>
          {product.description}
        </p>

        <div className="row justify-content-between mx-0">
          {!auth.user || auth.user.role !== "admin" ? userLink() : adminLink()}
        </div>
      </div>
    </div>
  );
};
export default ProductItem;
