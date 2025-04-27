import React from 'react';
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
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { LearningStage } from '../../../services/db';
import { TopicProgress } from '../../../hooks/useProgressCalculation';

interface ProgressIndicatorProps {
  topicProgress: TopicProgress[];
  overallProgress: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  topicProgress,
  overallProgress,
}) => {
  const { t } = useTranslation(['common', 'lessons']);

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

              {stage.urgentTopics.length > 0 && (
                <>
                  <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
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
