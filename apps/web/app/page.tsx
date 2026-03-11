const foundations = [
  "Multi-tenant platform with club subdomains",
  "Permissions-based authorization model",
  "Internationalization from day 0",
  "Local-first development with GitHub, Vercel, and Supabase",
];

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Sail Tracker</p>
        <h1>Hello world, foundation first.</h1>
        <p className="lede">
          This workspace is set up to prove the path from local development to CI
          before product features are added.
        </p>
      </section>

      <section className="panel">
        <h2>Current baseline</h2>
        <ul>
          {foundations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

