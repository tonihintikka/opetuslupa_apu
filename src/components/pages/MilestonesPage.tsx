import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from '../common/LoadingIndicator';
import { useStudents } from '../../hooks';

/**
 * Redirect component that sends users to the LessonsPage with teaching tips tab
 * This replaces the old MilestonesPage to support the new "Vinkit" concept
 */
const MilestonesPage: React.FC = () => {
  const navigate = useNavigate();
  const { students, loading } = useStudents();

  useEffect(() => {
    if (!loading && students.length > 0) {
      // Redirect to the first student's page with the tips tab (index 2) active
      navigate(`/lessons`, {
        state: {
          redirectToStudentId: students[0].id,
          activeTab: 2, // Index for Tips tab
        },
      });
    }
  }, [loading, students, navigate]);

  return <LoadingIndicator />;
};

export default MilestonesPage;
