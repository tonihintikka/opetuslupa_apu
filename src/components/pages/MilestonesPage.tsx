import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from '../common/LoadingIndicator';

/**
 * Legacy redirect component that sends users to the new TipsPage
 * This maintains backward compatibility with any existing links to /milestones
 */
const MilestonesPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new tips page
    navigate('/tips', { replace: true });
  }, [navigate]);

  return <LoadingIndicator />;
};

export default MilestonesPage;
