import { STUDIES } from '../data/constants';

function StudiesPanel() {
  return (
    <section className="panel">
      <h2 className="section-label">스터디 & 활동</h2>
      <div className="studies-grid">
        {STUDIES.map((s) => (
          <article key={s.id} className={`study-card ${s.accent}`}>
            <div className="study-icon">{s.icon}</div>
            <div className="study-name">{s.name}</div>
            <div className="study-desc">{s.desc}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default StudiesPanel;
