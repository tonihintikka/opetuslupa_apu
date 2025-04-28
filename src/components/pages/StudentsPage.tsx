import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ShowChart as ShowChartIcon,
} from '@mui/icons-material';
import { useStudents } from '../../hooks';
import { Student } from '../../services';
import LoadingIndicator from '../common/LoadingIndicator';
import { useTranslation } from 'react-i18next';
import ProgressDashboard from '../lesson/progress/ProgressDashboard';

const StudentsPage: React.FC = () => {
  const { t } = useTranslation(['common', 'students']);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { students, loading, error, addStudent, updateStudent, deleteStudent } = useStudents();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    email: '',
    phone: '',
  });
  const [progressDialogOpen, setProgressDialogOpen] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | undefined>(undefined);

  const handleOpenDialog = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        email: student.email,
        phone: student.phone,
      });
    } else {
      setEditingStudent(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStudent(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenProgressDialog = (studentId: number) => {
    setSelectedStudentId(studentId);
    setProgressDialogOpen(true);
  };

  const handleCloseProgressDialog = () => {
    setProgressDialogOpen(false);
    setSelectedStudentId(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingStudent) {
        // Update existing student
        await updateStudent(editingStudent.id!, formData);
      } else {
        // Add new student
        await addStudent(formData as Omit<Student, 'id' | 'createdAt' | 'updatedAt'>);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (window.confirm(t('students:confirmDelete'))) {
      try {
        await deleteStudent(id);
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography color="error">Error loading students: {error.message}</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('students:title')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          size={isMobile ? 'small' : 'medium'}
        >
          {t('students:addStudent')}
        </Button>
      </Box>

      {students.length === 0 ? (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="body1" align="center">
              {t('students:noStudentsFound')}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <List
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          {students.map(student => (
            <React.Fragment key={student.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  py: 2,
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'flex-start' : 'center',
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    width: isMobile ? '100%' : 'auto',
                    pr: isMobile ? 0 : 8, // Make room for action buttons on desktop
                  }}
                >
                  <Typography variant="h6" component="div" sx={{ mb: 0.5 }}>
                    {student.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="div">
                    {student.email && (
                      <Box component="span" display="block" sx={{ mb: 0.5 }}>
                        Email: {student.email}
                      </Box>
                    )}
                    {student.phone && (
                      <Box component="span" display="block">
                        Phone: {student.phone}
                      </Box>
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    mt: isMobile ? 1 : 0,
                    width: isMobile ? '100%' : 'auto',
                    justifyContent: isMobile ? 'flex-end' : 'flex-end',
                  }}
                >
                  <IconButton
                    aria-label="view progress"
                    onClick={() => handleOpenProgressDialog(student.id!)}
                    size={isMobile ? 'small' : 'medium'}
                    color="primary"
                    title={t('students:progress')}
                  >
                    <ShowChartIcon />
                  </IconButton>
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleOpenDialog(student)}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{ ml: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteStudent(student.id!)}
                    sx={{ ml: 1 }}
                    size={isMobile ? 'small' : 'medium'}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Add/Edit Student Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingStudent ? t('students:editStudent') : t('students:addNewStudent')}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label={t('students:name')}
              type="text"
              fullWidth
              required
              value={formData.name}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="email"
              label={t('students:email')}
              type="email"
              fullWidth
              value={formData.email || ''}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="phone"
              label={t('students:phone')}
              type="tel"
              fullWidth
              value={formData.phone || ''}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>{t('actions.cancel')}</Button>
            <Button type="submit" variant="contained" color="primary">
              {t('actions.save')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Progress Dashboard Dialog */}
      <Dialog
        open={progressDialogOpen}
        onClose={handleCloseProgressDialog}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {t('students:progress')}
          {selectedStudentId && students.find(s => s.id === selectedStudentId) && (
            <>: {students.find(s => s.id === selectedStudentId)?.name}</>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedStudentId && <ProgressDashboard studentId={selectedStudentId} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProgressDialog}>{t('actions.close')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentsPage;
