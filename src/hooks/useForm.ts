import { useForm as useReactHookForm, UseFormProps, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export type FormLibrary = 'react-hook-form' | 'olapat';

export interface UseFormConfig<T extends Record<string, any> = any> {
  library?: FormLibrary;
  defaultValues?: T;
  validationSchema?: z.ZodSchema;
  resolver?: 'zod' | 'yup' | 'custom';
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}

/**
 * Custom useForm hook that supports both react-hook-form and olapat
 * 
 * Usage with react-hook-form:
 * ```tsx
 * const schema = z.object({
 *   email: z.string().email(),
 *   password: z.string().min(6),
 * });
 * 
 * const { register, handleSubmit, formState: { errors } } = useForm({
 *   library: 'react-hook-form',
 *   validationSchema: schema,
 *   resolver: 'zod',
 * });
 * ```
 * 
 * Usage with olapat:
 * ```tsx
 * const { register, handleSubmit, errors } = useForm({
 *   library: 'olapat',
 *   defaultValues: { email: '', password: '' },
 * });
 * ```
 */
export function useForm<T extends Record<string, any> = any>(
  config: UseFormConfig<T> = {}
): UseFormReturn<T> | any {
  const {
    library = 'react-hook-form',
    defaultValues,
    validationSchema,
    resolver = 'zod',
    mode = 'onChange',
  } = config;

  if (library === 'olapat') {
    // Dynamic import for olapat
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { useForm: useOlapatForm } = require('olapat');
      return useOlapatForm({
        defaultValues,
        mode,
      });
    } catch (error) {
      console.warn('olapat not installed, falling back to react-hook-form');
      // Fallback to react-hook-form
    }
  }

  // Default to react-hook-form
  const formConfig: UseFormProps<T> = {
    defaultValues,
    mode,
  };

  // Add resolver if validation schema is provided
  if (validationSchema && resolver === 'zod') {
    formConfig.resolver = zodResolver(validationSchema);
  }

  return useReactHookForm<T>(formConfig);
}

// Re-export react-hook-form utilities
export {
  Controller,
  FormProvider,
  useFormContext,
  useController,
  useWatch,
  useFieldArray,
} from 'react-hook-form';

export type {
  FieldValues,
  UseFormProps,
  UseFormReturn,
  FieldErrors,
  Control,
  ControllerProps,
} from 'react-hook-form';

