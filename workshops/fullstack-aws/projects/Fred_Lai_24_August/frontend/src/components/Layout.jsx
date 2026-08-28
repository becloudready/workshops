// Shared page layout used by the dashboards.
// Controls the overall page structure, spacing, and placement of shared navigation.

import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <Navbar />
      </header>

      <main className="flex-1">{children}</main>

      <footer></footer>
    </div>
  );
}

export default Layout;
