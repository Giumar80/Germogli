export type Screen = 'diario' | 'catalogo' | 'guida' | 'profilo' | 'crops' | 'agronomo';

export interface Crop {
  id: string;
  name: string;
  phase: string;
  day: number;
  progress: number;
  image: string;
  stats?: {
    temp: string;
    watering: string;
  };
}

export interface Seed {
  id: string;
  name: string;
  description: string;
  time: string;
  difficulty: 'Facile' | 'Medio' | 'Esperto';
  image: string;
  badge?: string;
  badgeType?: 'superfood' | 'spicy' | 'protein' | 'fast';
  cultivationModule: {
    instructions: string[];
    idealTemp: string;
    wateringFreq: string;
    nutrients: string[];
    harvestTips: string;
  };
}

export interface Step {
  id: number;
  title: string;
  description: string;
  image: string;
  label: string;
  checklist: string[];
  duration: string;
}
