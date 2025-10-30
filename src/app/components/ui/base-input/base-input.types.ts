export type InputControlVariant = 'input' | 'textarea' | 'checkbox' | 'radio';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputOption<TValue> {
  label: string;
  value: TValue;
  disabled?: boolean;
  description?: string;
}

export type InputErrorMessages = Partial<
  Record<
    string,
    string | ((error: unknown, context: { label?: string; placeholder?: string }) => string)
  >
>;
