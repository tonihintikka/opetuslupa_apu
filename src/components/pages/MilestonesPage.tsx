import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from '../common/LoadingIndicator';

/**
 * Legacy redirect component that sends users to the new VinkitPage
 * This maintains backward compatibility with any existing links to /milestones
 */
const MilestonesPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new vinkit page
    navigate('/vinkit', { replace: true });
  }, [navigate]);

  return <LoadingIndicator />;
};

export default MilestonesPage;
