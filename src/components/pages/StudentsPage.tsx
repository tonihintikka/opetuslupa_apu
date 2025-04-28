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
import { Student, Lesson } from '../../services/db';
import LoadingIndicator from '../common/LoadingIndicator';
import { useTranslation } from 'react-i18next';
import ProgressDashboard from '../lesson/progress/ProgressDashboard';
import LessonForm from '../lesson/LessonForm';
import { useLessonForm } from '../lesson/useLessonForm';
import lessonService from '../../services/lessonService';

const StudentsPage: React.FC = () => {
  const { t } = useTranslation(['common', 'students', 'lessons']);
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

  const { isOpen: isLessonFormOpen, resetForm: resetLessonForm } = useLessonForm();

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
    setFormData((prev: Partial<Student>) => ({
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

  const handleSubmitStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id!, formData);
      } else {
        await addStudent(formData as Omit<Student, 'id' | 'createdAt' | 'updatedAt'>);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleSaveLesson = async (
    lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>,
    editingId?: number,
  ) => {
    try {
      if (editingId) {
        await lessonService.update(editingId, lessonData);
      } else {
        await lessonService.add(lessonData);
      }
      resetLessonForm();
    } catch (saveError) {
      console.error('Error saving lesson:', saveError);
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
                    pr: isMobile ? 0 : 8,
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

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <form onSubmit={handleSubmitStudent}>
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
          {progressDialogOpen && selectedStudentId && (
            <ProgressDashboard studentId={selectedStudentId} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProgressDialog}>{t('actions.close')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isLessonFormOpen}
        onClose={resetLessonForm}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>{t('lessons:lessonDetails')}</DialogTitle>
        <DialogContent>
          {isLessonFormOpen && (
            <LessonForm
              students={students}
              onSubmit={handleSaveLesson}
              onCancel={resetLessonForm}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default StudentsPage;
