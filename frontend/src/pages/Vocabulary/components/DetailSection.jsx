function DetailSection({ id, jaLabel, zhLabel, children }) {
  if (!children) return null;

  return (
    <section className={`detail-section section-${id}`}>
      <h3 className="detail-section-title">
        <span className="section-label-ja">{jaLabel}</span>
        {zhLabel && <span className="section-label-zh">{zhLabel}</span>}
      </h3>
      {children}
    </section>
  );
}

export default DetailSection;
