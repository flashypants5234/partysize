export default function NotAuthorized({
  logoutAction,
}: {
  logoutAction: (formData: FormData) => void;
}) {
  return (
    <main className="as-skin">
      <section className="section">
        <div className="container" style={{ maxWidth: 420 }}>
          <h1>Not Authorized</h1>
          <p>This account does not have admin access, or has been banned/deactivated.</p>
          <form action={logoutAction}>
            <button type="submit" className="btn btn-outline">
              Sign Out
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}