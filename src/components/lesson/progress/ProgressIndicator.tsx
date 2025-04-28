import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Chip,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Collapse,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  PlayArrow as PlayArrowIcon,
  KeyboardArrowRight as ArrowRightIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLessonForm } from '../LessonFormContext';
import { LearningStage } from '../../../services/db';
import { TopicProgress } from '../../../hooks/useProgressCalculation';
import { getSubTopicsForTopic } from '../../../constants/lessonSubTopics';

interface ProgressIndicatorProps {
  topicProgress: TopicProgress[];
  overallProgress: number;
  studentId?: number; // Add studentId to be able to start a lesson for the student
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  topicProgress,
  overallProgress,
  studentId,
}) => {
  const { t } = useTranslation(['common', 'lessons']);
  const { openWithSelections } = useLessonForm();
  const navigate = useNavigate();

  // Track expanded topic items to show sub-topics
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);

  // Group topics by stage
  const groupedTopics = React.useMemo(() => {
    const grouped: Record<LearningStage, TopicProgress[]> = {
      kognitiivinen: [],
      assosiatiivinen: [],
      automaattinen: [],
    };

    topicProgress.forEach(topic => {
      grouped[topic.stage].push(topic);
    });

    return grouped;
  }, [topicProgress]);

  // Calculate stage progress
  const stageProgress = React.useMemo(() => {
    const stages: LearningStage[] = ['kognitiivinen', 'assosiatiivinen', 'automaattinen'];

    return stages.map(stage => {
      const topics = groupedTopics[stage];
      const totalCompleted = topics.reduce((sum, topic) => sum + topic.completedMinutes, 0);
      const totalRecommended = topics.reduce((sum, topic) => sum + topic.recommendedMinutes, 0);
      const progress = totalRecommended > 0 ? (totalCompleted / totalRecommended) * 100 : 0;

      // Get most urgent topics (least progress)
      const urgentTopics = [...topics]
        .sort((a, b) => a.progressPercent - b.progressPercent)
        .slice(0, 2);

      return {
        stage,
        progress: Math.round(progress),
        totalCompleted,
        totalRecommended,
        topics: topics.length,
        urgentTopics,
      };
    });
  }, [groupedTopics]);

  // Toggle topic expansion to show sub-topics
  const toggleTopicExpansion = (topicId: string) => {
    setExpandedTopics(prev =>
      prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId],
    );
  };

  // Start a new lesson focused on a specific topic or sub-topic
  const handleStartLessonForTopic = (topicId: string, subTopicId?: string) => {
    // Determine the learning stage of the selected topic
    const selectedTopic = topicProgress.find(t => t.topicId === topicId);
    const stage = selectedTopic?.stage;

    openWithSelections({
      topics: [topicId],
      subTopics: subTopicId ? [subTopicId] : undefined,
      studentId: studentId,
      learningStage: stage,
    });

    // Navigate to the lessons page so the form dialog is visible
    navigate('/lessons');
  };

  // Get stage name
  const getStageName = (stage: LearningStage): string => {
    return t(`lessons:stages.${stage}`, stage);
  };

  // Format minutes
  const formatMinutes = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);

    if (hours === 0) {
      return `${mins}min`;
    }

    return hours > 0 ? `${hours}h ${mins > 0 ? `${mins}min` : ''}` : `${mins}min`;
  };

  // Get progress color
  const getProgressColor = (percent: number): 'success' | 'warning' | 'error' => {
    if (percent >= 75) return 'success';
    if (percent >= 50) return 'warning';
    return 'error';
  };

  // Get icon for progress
  const getProgressIcon = (percent: number) => {
    const color = getProgressColor(percent);
    switch (color) {
      case 'success':
        return <CheckCircleIcon fontSize="small" color="success" />;
      case 'warning':
        return <WarningIcon fontSize="small" color="warning" />;
      case 'error':
        return <ErrorIcon fontSize="small" color="error" />;
      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Overall progress card */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('lessons:progress.overallProgress', 'Overall Progress')}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ flexGrow: 1, mr: 2 }}>
              <LinearProgress
                variant="determinate"
                value={overallProgress}
                color={getProgressColor(overallProgress)}
                sx={{ height: 10, borderRadius: 1 }}
              />
            </Box>
            <Typography variant="h6">{overallProgress}%</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {t('lessons:progress.totalTopics', 'Total Topics')}: {topicProgress.length}
          </Typography>
        </CardContent>
      </Card>

      {/* Stage accordions */}
      {stageProgress.map(stage => (
        <Accordion key={stage.stage} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">{getStageName(stage.stage)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {stage.topics} {t('lessons:progress.topics', 'topics')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  label={`${stage.progress}%`}
                  size="small"
                  color={getProgressColor(stage.progress)}
                  sx={{ mr: 1 }}
                />
              </Box>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {formatMinutes(stage.totalCompleted)} / {formatMinutes(stage.totalRecommended)}
              </Typography>

              <LinearProgress
                variant="determinate"
                value={stage.progress}
                color={getProgressColor(stage.progress)}
                sx={{ height: 8, borderRadius: 1, mb: 2 }}
              />

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                {t('lessons:progress.allTopics', 'All Topics')}:
              </Typography>

              <Stack spacing={1}>
                {groupedTopics[stage.stage].map(topic => {
                  const isExpanded = expandedTopics.includes(topic.topicId);
                  const subTopics = getSubTopicsForTopic(topic.topicId);
                  const hasSubTopics = subTopics.length > 0;

                  return (
                    <Box key={topic.topicId}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                          cursor: hasSubTopics ? 'pointer' : 'default',
                        }}
                        onClick={
                          hasSubTopics ? () => toggleTopicExpansion(topic.topicId) : undefined
                        }
                      >
                        {getProgressIcon(topic.progressPercent)}
                        <Box sx={{ ml: 1, flex: 1 }}>
                          <Typography variant="body1">{topic.topicLabel}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {topic.progressPercent}% · {formatMinutes(topic.completedMinutes)} /{' '}
                            {formatMinutes(topic.recommendedMinutes)}
                          </Typography>
                        </Box>
                        {studentId && (
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={e => {
                              e.stopPropagation();
                              handleStartLessonForTopic(topic.topicId);
                            }}
                            title={t(
                              'lessons:progress.startLessonForTopic',
                              'Start lesson for this topic',
                            )}
                          >
                            <PlayArrowIcon />
                          </IconButton>
                        )}
                        {hasSubTopics && (
                          <IconButton
                            size="small"
                            sx={{
                              transform: isExpanded ? 'rotate(90deg)' : 'none',
                              transition: 'transform 0.2s',
                            }}
                          >
                            <ArrowRightIcon />
                          </IconButton>
                        )}
                      </Box>

                      {/* Sub-topics collapse section */}
                      {hasSubTopics && (
                        <Collapse in={isExpanded}>
                          <List disablePadding sx={{ pl: 4, mt: 1, mb: 1 }}>
                            {subTopics.map(subTopic => (
                              <ListItem
                                key={subTopic.key}
                                secondaryAction={
                                  studentId && (
                                    <IconButton
                                      edge="end"
                                      size="small"
                                      color="primary"
                                      onClick={() =>
                                        handleStartLessonForTopic(topic.topicId, subTopic.key)
                                      }
                                      title={t(
                                        'lessons:progress.startLessonForSubTopic',
                                        'Start lesson for this sub-topic',
                                      )}
                                    >
                                      <PlayArrowIcon fontSize="small" />
                                    </IconButton>
                                  )
                                }
                                sx={{
                                  borderBottom: '1px solid',
                                  borderColor: 'divider',
                                  py: 0.75,
                                }}
                              >
                                <ListItemText
                                  primary={subTopic.label}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Collapse>
                      )}
                    </Box>
                  );
                })}
              </Stack>

              {stage.urgentTopics.length > 0 && (
                <>
                  <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                    {t('lessons:progress.topicsNeedingAttention', 'Topics Needing Attention')}:
                  </Typography>

                  <Stack spacing={1}>
                    {stage.urgentTopics.map(topic => (
                      <Box
                        key={topic.topicId}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 1,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        {getProgressIcon(topic.progressPercent)}
                        <Box sx={{ ml: 1, flex: 1 }}>
                          <Typography variant="body2">{topic.topicLabel}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {topic.progressPercent}% · {formatMinutes(topic.remainingMinutes)}{' '}
                            {t('lessons:progress.remaining', 'remaining')}
                          </Typography>
                        </Box>
                        {studentId && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<PlayArrowIcon />}
                            onClick={() => handleStartLessonForTopic(topic.topicId)}
                          >
                            {t('lessons:progress.startLesson', 'Start Lesson')}
                          </Button>
                        )}
                      </Box>
                    ))}
                  </Stack>
                </>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ProgressIndicator;
