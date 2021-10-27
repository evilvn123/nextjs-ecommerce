import { useContext } from "react";
import { deleteItem } from "../store/Action";
import { DataContext } from "../store/GlobalState";

const Modal = () => {
  const { state, dispatch } = useContext(DataContext);

  const {modal} = state;

  const handleSubmit = () => {
    if (modal.length !== 0) {
      for (const item of modal) {
        if (item.type === "ADD_CART") {
          dispatch(deleteItem(item.data, item.id, item.type));
        }

        // if (item.type === "ADD_USERS") deleteUser(item);

        // if (item.type === "ADD_CATEGORIES") deleteCategories(item);

        // if (item.type === "DELETE_PRODUCT") deleteProduct(item);

        dispatch({ type: "ADD_MODAL", payload: [] });
      }
    }
  };
  return (
    <div
      className="modal fade"
      id="modal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-capitalize" id="exampleModalLabel">
              {/* {modal.length !== 0 && modal[0].title} */}
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">Bạn muốn xoá?</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              onClick={handleSubmit}
            >
              Xác nhận
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-dismiss="modal"
            >
              Không
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modal;
