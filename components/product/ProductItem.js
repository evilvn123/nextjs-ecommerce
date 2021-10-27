import Link from "next/link";
import { useContext } from "react";
import { addToCart } from "../../store/Action";
import { DataContext } from "../../store/GlobalState";

const ProductItem = ({ product }) => {
  const { state, dispatch } = useContext(DataContext);
  const { cart } = state;

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
  return (
    <div className="card" style={{ width: "18rem" }}>
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

        <div className="row justify-content-center mx-0">{userLink()}</div>
      </div>
    </div>
  );
};
export default ProductItem;
