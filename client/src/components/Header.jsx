function Header() {
    async function logout() {
      const res = await fetch("/registration/logout/", {
        credentials: "same-origin",
      });
  
      if (res.ok) {
        window.location = "/registration/sign_in/";
      }
    }
  
    return (
        <header>
        <h1>Meal Planner & Recipe Tracker</h1>
        <button onClick={logout}>Logout</button>
        </header>
    );
}
  
export default Header;  