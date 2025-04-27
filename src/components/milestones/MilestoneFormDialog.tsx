import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  SelectChangeEvent,
} from '@mui/material';
import { Milestone, Student } from '../../services/db';

interface MilestoneFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (milestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  milestone?: Milestone | null;
  title: string;
  students: Student[];
}

const MilestoneFormDialog: React.FC<MilestoneFormDialogProps> = ({
  open,
  onClose,
  onSave,
  milestone,
  title,
  students,
}) => {
  const [formData, setFormData] = useState<{
    studentId: number | '';
    title: string;
    description: string;
  }>({
    studentId: milestone?.studentId || '',
    title: milestone?.title || '',
    description: milestone?.description || '',
  });
  const [errors, setErrors] = useState<{
    studentId?: string;
    title?: string;
  }>({});

  // Update form data when milestone changes
  useEffect(() => {
    if (milestone) {
      setFormData({
        studentId: milestone.studentId || '',
        title: milestone.title || '',
        description: milestone.description || '',
      });
    }
  }, [milestone]);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>,
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));

      // Clear validation error when field is edited
      if (errors[name as keyof typeof errors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<number | ''>) => {
    const { name, value } = event.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));

      // Clear validation error when field is edited
      if (errors[name as keyof typeof errors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.studentId) {
      newErrors.studentId = 'Student is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await onSave({
        studentId: formData.studentId as number,
        title: formData.title,
        description: formData.description,
      });
      onClose();
    } catch (error) {
      console.error('Error saving milestone:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal" error={!!errors.studentId}>
          <InputLabel id="student-select-label">Student</InputLabel>
          <Select
            labelId="student-select-label"
            id="student-select"
            name="studentId"
            value={formData.studentId}
            label="Student"
            onChange={handleSelectChange}
          >
            {students.map(student => (
              <MenuItem key={student.id} value={student.id}>
                {student.name}
              </MenuItem>
            ))}
          </Select>
          {errors.studentId && <FormHelperText>{errors.studentId}</FormHelperText>}
        </FormControl>

        <TextField
          margin="normal"
          id="title"
          name="title"
          label="Milestone Title"
          type="text"
          fullWidth
          value={formData.title}
          onChange={handleTextChange}
          error={!!errors.title}
          helperText={errors.title}
        />

        <TextField
          margin="normal"
          id="description"
          name="description"
          label="Description"
          multiline
          rows={4}
          fullWidth
          value={formData.description}
          onChange={handleTextChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MilestoneFormDialog;
