import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * Custom useForm hook that supports both react-hook-form and olapat
 * 
 * Usage with react-hook-form:
 * ```jsx
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
 * ```jsx
 * const { register, handleSubmit, errors } = useForm({
 *   library: 'olapat',
 *   defaultValues: { email: '', password: '' },
 * });
 * ```
 */
export function useForm(config = {}) {
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
  const formConfig = {
    defaultValues,
    mode,
  };

  // Add resolver if validation schema is provided
  if (validationSchema && resolver === 'zod') {
    formConfig.resolver = zodResolver(validationSchema);
  }

  return useReactHookForm(formConfig);
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

