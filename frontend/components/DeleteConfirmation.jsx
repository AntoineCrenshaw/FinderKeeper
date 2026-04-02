import "../../frontend/components/styling/DeleteConfirmation.css";

function DeleteConfirmation({ handleDelete, postId, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="delete-confirmation-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="delete-confirmation-title">Delete Post</h2>
        <p className="delete-confirmation-desc">
          Are you sure you want to delete this post? This action cannot be
          undone
        </p>
        <button
          className="btn-confirm"
          type="button"
          onClick={() => {
            handleDelete(postId);
            onClose();
          }}
        >
          Yes
        </button>
        <button className="btn-cancel" type="button" onClick={onClose}>
          No
        </button>
      </div>
    </div>
  );
}

export default DeleteConfirmation;
