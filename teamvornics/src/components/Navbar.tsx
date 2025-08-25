import { Link } from "react-router-dom";
import { Button } from "./ui/Button";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 p-4 fixed w-full top-0 z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold tracking-wide">
          AutoLight
        </div>
        <div className="space-x-2 sm:space-x-4">
          <Button asChild variant="ghost" className="text-white">
            <Link to="/">Home</Link>
          </Button>
          <Button asChild variant="ghost" className="text-white">
            <Link to="/#about">About</Link>
          </Button>
          <Button asChild variant="ghost" className="text-white">
            <Link to="/#benefits">Benefits</Link>
          </Button>
          <Button asChild variant="ghost" className="text-white">
            <Link to="/contact">Contact</Link>
          </Button>
          <Button asChild variant="smart" size="sm">
            <Link to="/demo">See Demo</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
