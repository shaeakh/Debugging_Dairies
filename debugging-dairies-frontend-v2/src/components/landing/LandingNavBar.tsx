import { useNavigate } from 'react-router-dom';

const LandingNavBar = () => {
  const navigate = useNavigate();

  const routeToAuthPage = () => {
    navigate('/auth');
  };

  return (
    <div className="flex items-center justify-end px-8 py-5 ">
      <div className="flex items-center gap-2">
        <button className="text-muted-foreground hover:text-foreground transition-colors text-sm px-4 py-1.5 rounded-md border border-border shadow-md">
          Documentation
        </button>
        <button
          onClick={routeToAuthPage}
          className="bg-primary text-primary-foreground text-sm font-medium px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingNavBar;
