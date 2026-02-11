import NavLink from './NavLink';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">MediChain</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/verify">Verify</NavLink>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/dda">DDA View</NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
