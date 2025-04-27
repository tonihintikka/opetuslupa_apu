import { LearningStage } from '../services/db';

export interface LessonSubTopic {
  key: string;
  label: string;
  parentTopicKey: string; // References the parent topic key
  stage: LearningStage;
}

// Define sub-topics for each main topic
export const lessonSubTopics: LessonSubTopic[] = [
  // Ajoasento ja peilit sub-topics
  {
    key: 'ajoasento_istuma',
    label: 'Oikea istuma-asento',
    parentTopicKey: 'ajoasento',
    stage: 'kognitiivinen',
  },
  {
    key: 'ajoasento_peilit',
    label: 'Peilien säätö',
    parentTopicKey: 'ajoasento',
    stage: 'kognitiivinen',
  },
  {
    key: 'ajoasento_turvavyo',
    label: 'Turvavyön käyttö',
    parentTopicKey: 'ajoasento',
    stage: 'kognitiivinen',
  },

  // Liikkeellelähtö ja pysähtyminen sub-topics
  {
    key: 'liikkeellelahto_kytkin',
    label: 'Kytkimen hallinta',
    parentTopicKey: 'liikkeellelahto',
    stage: 'kognitiivinen',
  },
  {
    key: 'liikkeellelahto_kaasu',
    label: 'Kaasun annostelu',
    parentTopicKey: 'liikkeellelahto',
    stage: 'kognitiivinen',
  },
  {
    key: 'liikkeellelahto_jarrutus',
    label: 'Pehmeä jarrutus',
    parentTopicKey: 'liikkeellelahto',
    stage: 'kognitiivinen',
  },

  // Vaihteiden vaihto sub-topics
  {
    key: 'vaihteet_ylös',
    label: 'Vaihto ylöspäin',
    parentTopicKey: 'vaihteet',
    stage: 'kognitiivinen',
  },
  {
    key: 'vaihteet_alas',
    label: 'Vaihto alaspäin',
    parentTopicKey: 'vaihteet',
    stage: 'kognitiivinen',
  },
  {
    key: 'vaihteet_oikea_vaihde',
    label: 'Oikean vaihteen valinta',
    parentTopicKey: 'vaihteet',
    stage: 'kognitiivinen',
  },

  // Add more sub-topics for each parent topic...
  // Risteysajo sub-topics
  {
    key: 'risteysajo_liittyminen',
    label: 'Liikenteeseen liittyminen',
    parentTopicKey: 'risteysajo',
    stage: 'assosiatiivinen',
  },
  {
    key: 'risteysajo_vaistamissaannot',
    label: 'Väistämissäännöt',
    parentTopicKey: 'risteysajo',
    stage: 'assosiatiivinen',
  },

  // Add more for other topics as needed
];

// Helper function to get sub-topics for a specific parent topic
export const getSubTopicsForTopic = (topicKey: string): LessonSubTopic[] => {
  return lessonSubTopics.filter(subTopic => subTopic.parentTopicKey === topicKey);
};

// Helper function to get a sub-topic label by its key
export const getSubTopicLabel = (key: string): string => {
  const subTopic = lessonSubTopics.find(t => t.key === key);
  return subTopic ? subTopic.label : key; // Return key if label not found
};
