export default function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--color-divider)", padding: "var(--space-8) 0" }}>
      <div
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "0 var(--space-8)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "var(--color-neutral-500)",
          fontSize: 13,
        }}
      >
        <span>© 2026 Alik Sloyan</span>
        <div style={{ display: "flex", gap: "var(--space-4)" }}>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <i className="ph ph-github-logo"></i>
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <i className="ph ph-linkedin-logo"></i>
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <i className="ph ph-envelope-simple"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
