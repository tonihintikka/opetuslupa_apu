import { LearningStage } from '../services/db';

export interface LessonTopic {
  key: string;
  label: string;
  stage: LearningStage;
}

export const lessonTopics: LessonTopic[] = [
  // Kognitiivinen vaihe (Cognitive Stage)
  { key: 'ajoasento', label: 'Ajoasento ja peilit', stage: 'kognitiivinen' },
  { key: 'liikkeellelahto', label: 'Liikkeellelähtö ja pysähtyminen', stage: 'kognitiivinen' },
  { key: 'vaihteet', label: 'Vaihteiden vaihto', stage: 'kognitiivinen' },
  { key: 'ohjaus', label: 'Ohjauksen hallinta', stage: 'kognitiivinen' },
  { key: 'peruutus', label: 'Peruuttaminen', stage: 'kognitiivinen' },
  { key: 'makilahto', label: 'Mäkilähdöt', stage: 'kognitiivinen' },

  // Assosiatiivinen vaihe (Associative Stage)
  { key: 'taajamaajo', label: 'Ajaminen taajamassa', stage: 'assosiatiivinen' },
  { key: 'risteysajo', label: 'Risteysajo', stage: 'assosiatiivinen' },
  { key: 'liikennevalot', label: 'Liikennevalot', stage: 'assosiatiivinen' },
  { key: 'liikenneympyrat', label: 'Liikenneympyrät', stage: 'assosiatiivinen' },
  { key: 'kaistanvaihto', label: 'Kaistanvaihdot ja liittymät', stage: 'assosiatiivinen' },
  { key: 'maantieajo', label: 'Maantieajo', stage: 'assosiatiivinen' },
  { key: 'moottoritieajo', label: 'Moottoritieajo', stage: 'assosiatiivinen' },
  { key: 'pysakointi', label: 'Pysäköinti (tasku, vino, ruutu)', stage: 'assosiatiivinen' },
  { key: 'ajopimealla', label: 'Ajaminen pimeällä', stage: 'assosiatiivinen' },
  { key: 'ajosateella', label: 'Ajaminen sateella', stage: 'assosiatiivinen' },

  // Automaattinen vaihe (Automatic Stage)
  { key: 'riskientunnistus', label: 'Riskientunnistus', stage: 'automaattinen' },
  {
    key: 'valojenhallinta',
    label: 'Pimeällä ajaminen ja valojen hallinta',
    stage: 'automaattinen',
  },
  {
    key: 'liukaskeli',
    label: 'Liukkaalla kelillä ajaminen (teoria/simulaatio)',
    stage: 'automaattinen',
  },
  { key: 'hatajarrutus', label: 'Hätäjarrutus', stage: 'automaattinen' },
  { key: 'vaistamistilanne', label: 'Väistämistilanteet', stage: 'automaattinen' },
  { key: 'ajokoe_simulaatio', label: 'Ajokokeen simulaatio', stage: 'automaattinen' },
  { key: 'itsenainen_ajo', label: 'Itsenäinen ajaminen', stage: 'automaattinen' },
];

// Helper function to get topics for a specific stage
export const getTopicsForStage = (stage: LearningStage): LessonTopic[] => {
  return lessonTopics.filter(topic => topic.stage === stage);
};

// Helper function to get a topic label by its key
export const getTopicLabel = (key: string): string => {
  const topic = lessonTopics.find(t => t.key === key);
  return topic ? topic.label : key; // Return key if label not found
};
