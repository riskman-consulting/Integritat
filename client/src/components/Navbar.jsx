const Navbar = () => {
  return (
    <nav className="h-14 bg-white shadow flex items-center px-6 justify-between">
      <h2 className="font-semibold text-lg">Admin Dashboard</h2>
      <button className="bg-blue-600 text-white px-4 py-1 rounded">Logout</button>
    </nav>
  );
};

export default Navbar;
