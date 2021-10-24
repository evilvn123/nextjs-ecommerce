import { useState } from "react";
import { getData } from "../utils/fetchData";
import Head from "next/head";
import ProductItem from "../components/product/ProductItem";

export default function Home(props) {
  const [products, setProducts] = useState(props.products);
  return (
    <div className="products">
      <Head>
        <title>Home page</title>
      </Head>
      {products.length === 0 ? (
        <h2>No products</h2>
      ) : (
        products.map((product) => (
          <ProductItem key={product._id} product={product} />
        ))
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const res = await getData("product");
  return {
    props: {
      products: res.products,
      result: res.result,
    }, // will be passed to the page component as props
  };
}
