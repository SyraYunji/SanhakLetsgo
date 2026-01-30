import { useState, useEffect } from 'react';

function AttendanceModal({ isOpen, onClose, sessionLabel, members, attendance = [], onSave }) {
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    if (isOpen) setChecked(Array.isArray(attendance) ? [...attendance] : []);
  }, [isOpen, attendance]);

  const toggle = (name) => {
    setChecked((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(checked);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay is-open`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="attendanceModalTitle"
    >
      <div className="modal modal--attendance">
        <div className="modal-header">
          <h3 id="attendanceModalTitle">출석 체크 · {sessionLabel}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <p className="attendance-hint">참석한 팀원을 선택하세요.</p>
          <div className="attendance-checkboxes">
            {members.map((name) => (
              <label key={name} className="attendance-check">
                <input
                  type="checkbox"
                  checked={checked.includes(name)}
                  onChange={() => toggle(name)}
                />
                <span>{name}</span>
              </label>
            ))}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn btn-primary">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AttendanceModal;
