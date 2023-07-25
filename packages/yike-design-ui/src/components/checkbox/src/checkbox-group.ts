import { Size } from '../../../utils/constant';
export type CheckboxGropProps = {
  modelValue?: Array<string | number | boolean>;
  defaultValue?: Array<string | number | boolean>;
  disabled?: boolean;
  max?: number;
  tag?: string;
  direction?: 'horizontal' | 'vertical';
  options?: Array<CheckboxOption | string | number>;
  size?: Size | number | number[];
};

export type CheckboxOption = {
  label: string;
  value: string | number;
  disabled?: boolean;
  indeterminate?: boolean;
};
