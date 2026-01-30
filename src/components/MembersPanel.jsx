function MembersPanel({ members, onMemberClick }) {
  return (
    <section className="panel">
      <h2 className="section-label">팀원</h2>
      <p className="panel-hint">클릭하면 해당 팀원이 참여한 일정만 보기</p>
      <div className="members-list">
        {members.map((name) => (
          <button
            key={name}
            type="button"
            className="member-chip member-chip--clickable"
            onClick={() => onMemberClick?.(name)}
          >
            {name}
          </button>
        ))}
      </div>
    </section>
  );
}

export default MembersPanel;
