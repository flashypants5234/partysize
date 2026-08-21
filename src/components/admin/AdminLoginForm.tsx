export default function AdminLoginForm({
  error,
  action,
}: {
  error?: string;
  action: (formData: FormData) => void;
}) {
  return (
    <main className="as-skin">
      <section className="section">
        <div className="container" style={{ maxWidth: 420 }}>
          <h1>Admin Sign In</h1>
          {error && (
            <p className="form-note" style={{ color: "#B3261E" }}>
              {error}
            </p>
          )}
          <form action={action} className="form-card">
            <div className="field">
              <label htmlFor="email">Username</label>
              <input id="email" name="email" type="text" required placeholder="admin" />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" required placeholder="temp" />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Sign In
            </button>
            <p className="form-note">Dev login: admin / temp</p>
          </form>
        </div>
      </section>
    </main>
  );
}