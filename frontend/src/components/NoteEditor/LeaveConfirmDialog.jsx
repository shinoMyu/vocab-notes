function LeaveConfirmDialog({ onCancel, onDiscard, onSaveAndLeave }) {
  return (
    <div className="note-modal-overlay" onClick={onCancel}>
      <div
        className="note-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-leave-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="note-leave-title">尚有未儲存的變更</h3>

        <p>要先儲存目前的內容，還是直接離開？</p>

        <div className="note-modal-actions">
          <button
            type="button"
            className="note-button-secondary"
            onClick={onCancel}
          >
            取消
          </button>

          <button
            type="button"
            className="note-button-secondary"
            onClick={onDiscard}
          >
            捨棄並離開
          </button>

          <button
            type="button"
            className="note-button-primary"
            onClick={onSaveAndLeave}
          >
            儲存並離開
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeaveConfirmDialog;
