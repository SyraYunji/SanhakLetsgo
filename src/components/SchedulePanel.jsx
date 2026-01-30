import { STUDIES } from '../data/constants';
import { formatDate } from '../utils/format';

function SchedulePanel({
  schedules,
  scheduleFilter,
  onFilterChange,
  currentMember,
  onAddClick,
  onRemove,
  onAttendanceClick,
  updateAttendance,
}) {
  return (
    <section className="panel">
      <h2 className="section-label">다가오는 일정</h2>

      {currentMember && (
        <div className="schedule-tabs">
          <button
            type="button"
            className={scheduleFilter === 'all' ? 'active' : ''}
            onClick={() => onFilterChange('all')}
          >
            전체
          </button>
          <button
            type="button"
            className={scheduleFilter === 'mine' ? 'active' : ''}
            onClick={() => onFilterChange('mine')}
          >
            내 일정
          </button>
        </div>
      )}

      <div className="schedule-list">
        {schedules.length === 0 ? (
          <div className="schedule-empty">
            {scheduleFilter === 'mine' && currentMember
              ? '내가 참여하는 일정이 없어요.'
              : '등록된 일정이 없어요. 아래에서 추가해 보세요.'}
          </div>
        ) : (
          schedules.map((item) => {
            const study = STUDIES.find((s) => s.id === item.studyId);
            const studyName = study ? study.name : item.studyId;
            return (
              <div key={item.id} className="schedule-item">
                <span className="schedule-date">{formatDate(item.date)}</span>
                <span className="schedule-time">{item.time || ''}</span>
                <span className="schedule-study">{studyName}</span>
                {item.note ? <span className="schedule-note">{item.note}</span> : null}
                {item.participants && item.participants.length > 0 && (
                  <span className="schedule-participants">
                    참여: {item.participants.join(', ')}
                  </span>
                )}
                {item.attendance && item.attendance.length > 0 && (
                  <span className="schedule-attendance">
                    출석: {item.attendance.join(', ')}
                  </span>
                )}
                <div className="schedule-item-actions">
                  <button
                    type="button"
                    className="schedule-btn-attendance"
                    onClick={() => onAttendanceClick?.(item)}
                    aria-label="출석 체크"
                    title="출석 체크"
                  >
                    출석
                  </button>
                  <button
                    type="button"
                    className="schedule-delete"
                    onClick={() => onRemove(item.id)}
                    aria-label="삭제"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button type="button" className="btn-add-schedule" onClick={onAddClick}>
        + 일정 추가
      </button>
    </section>
  );
}

export default SchedulePanel;
