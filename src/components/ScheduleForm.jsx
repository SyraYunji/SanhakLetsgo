import { useState, useEffect } from 'react';
import { STUDIES, MEMBERS } from '../data/constants';

function ScheduleForm({ isOpen, onClose, onSubmit }) {
  const [studyId, setStudyId] = useState(STUDIES[0]?.id || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [note, setNote] = useState('');
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().slice(0, 10);
      setDate(today);
      setTime('19:00');
      setNote('');
      setParticipants([]);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      studyId,
      date,
      time,
      note,
      participants,
    });
  };

  const toggleParticipant = (name) => {
    setParticipants((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? 'is-open' : ''}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div className="modal">
        <div className="modal-header">
          <h3 id="modalTitle">일정 추가</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            <span>스터디/활동</span>
            <select value={studyId} onChange={(e) => setStudyId(e.target.value)} required>
              {STUDIES.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span>날짜</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
          <label>
            <span>시간</span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
          <label>
            <span>참여자</span>
            <div className="participants-checkboxes">
              {MEMBERS.map((name) => (
                <label key={name}>
                  <input
                    type="checkbox"
                    checked={participants.includes(name)}
                    onChange={() => toggleParticipant(name)}
                  />
                  {name}
                </label>
              ))}
            </div>
          </label>
          <label>
            <span>장소/비고</span>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="예: 스타벅스, 줌 링크 등"
            />
          </label>
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

export default ScheduleForm;
