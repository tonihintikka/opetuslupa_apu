import React, { useState } from 'react';
import { Container, Typography, Box, Button, Grid, Paper, IconButton, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useMilestones, useStudents } from '../../hooks';
import MilestoneFormDialog from '../milestones/MilestoneFormDialog';
import { Milestone } from '../../services';
import EmptyState from '../common/EmptyState';
import LoadingIndicator from '../common/LoadingIndicator';

/**
 * Milestones page component
 */
const MilestonesPage: React.FC = () => {
  const { students, loading: loadingStudents } = useStudents();
  const {
    milestones,
    loading: loadingMilestones,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    completeMilestone,
  } = useMilestones();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);

  const handleOpenDialog = (milestone?: Milestone) => {
    if (milestone) {
      setEditingMilestone(milestone);
    } else {
      setEditingMilestone(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMilestone(null);
  };

  const handleSaveMilestone = async (
    milestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    try {
      if (editingMilestone) {
        await updateMilestone(editingMilestone.id as number, milestone);
      } else {
        await addMilestone(milestone);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save milestone', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      try {
        await deleteMilestone(id);
      } catch (error) {
        console.error('Failed to delete milestone', error);
      }
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await completeMilestone(id);
    } catch (error) {
      console.error('Failed to complete milestone', error);
    }
  };

  if (loadingMilestones || loadingStudents) {
    return <LoadingIndicator />;
  }

  // Helper function to get student name by ID
  const getStudentName = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Milestones
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            New Milestone
          </Button>
        </Box>

        {milestones.length === 0 ? (
          <EmptyState
            title="No milestones yet"
            message="Create your first milestone to track student progress"
            actionText="Create Milestone"
            onAction={() => handleOpenDialog()}
          />
        ) : (
          <Grid container spacing={3}>
            {milestones.map(milestone => (
              <Grid size={12} key={milestone.id}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    position: 'relative',
                    bgcolor: milestone.completedAt ? 'success.lighter' : 'background.paper',
                    borderLeft: milestone.completedAt ? '4px solid' : 'none',
                    borderLeftColor: 'success.main',
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 8 }}>
                      <Typography variant="h6">{milestone.title}</Typography>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {getStudentName(milestone.studentId)}
                      </Typography>

                      {milestone.description && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {milestone.description}
                        </Typography>
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }} sx={{ textAlign: { sm: 'right' } }}>
                      <Box
                        display="flex"
                        justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
                        mb={1}
                      >
                        {milestone.completedAt ? (
                          <Chip
                            icon={<CheckCircleOutlineIcon />}
                            label={`Completed: ${milestone.completedAt.toLocaleDateString()}`}
                            color="success"
                            variant="outlined"
                          />
                        ) : (
                          <Chip label="Pending" variant="outlined" />
                        )}
                      </Box>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(milestone)}
                          color="primary"
                          aria-label="edit milestone"
                        >
                          <EditIcon />
                        </IconButton>

                        {!milestone.completedAt && (
                          <IconButton
                            size="small"
                            onClick={() => handleComplete(milestone.id as number)}
                            color="success"
                            aria-label="complete milestone"
                          >
                            <CheckCircleOutlineIcon />
                          </IconButton>
                        )}

                        <IconButton
                          size="small"
                          onClick={() => handleDelete(milestone.id as number)}
                          color="error"
                          aria-label="delete milestone"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2, color: 'text.secondary' }}>
                    <Typography variant="caption">
                      Created: {new Date(milestone.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <MilestoneFormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveMilestone}
        students={students}
        milestone={editingMilestone}
        title={editingMilestone ? 'Edit Milestone' : 'Add Milestone'}
      />
    </Container>
  );
};

export default MilestonesPage;
