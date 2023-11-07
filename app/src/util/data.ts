export interface CategoryOption {
  readonly value: string;
  readonly label: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

export interface PositionOption {
  readonly value: string;
  readonly label: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

export const categoryOptions: readonly CategoryOption[] = [
  { value: 'iniciante', label: 'Iniciante' },
  { value: 'sexta', label: '6ª Classe' },
  { value: 'quinta', label: '5ª Classe' },
  { value: 'quarta', label: '4ª Classe' },
  { value: 'terceira', label: '3ª Classe' },
  { value: 'segunda', label: '2ª Classe' },
  { value: 'primeira', label: '1ª Classe (Open)' }
];

export const positionOptions: readonly PositionOption[] = [
  { value: 'drive', label: 'Drive (Direita)' },
  { value: 'reves', label: 'Revés (Esquerda)' },
  { value: 'ambos', label: 'Ambos' },
];

export const vacanciesOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' }
];
