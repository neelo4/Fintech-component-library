import * as React from "react";
import { Button, ButtonProps } from "../Button";

export type FormValues = Record<string, string | boolean>;

export type FormFieldOption = {
  label: string;
  value: string;
};

export type FormFieldConfig = {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "checkbox";
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  options?: FormFieldOption[];
  description?: string;
  validate?: (value: FormValues[string], values: FormValues) => string | undefined;
  component?: (props: FieldRendererProps) => React.ReactNode;
};

export type FieldRendererProps = {
  field: FormFieldConfig;
  value: FormValues[string];
  error?: string;
  id: string;
  onChange: (value: FormValues[string]) => void;
  onBlur: () => void;
};

export type FormProps = {
  fields: FormFieldConfig[];
  initialValues?: Partial<FormValues>;
  onSubmit: (values: FormValues, helpers: { reset: () => void }) => void | Promise<void>;
  onChange?: (values: FormValues) => void;
  submitLabel?: string;
  className?: string;
  layout?: "vertical" | "horizontal";
  submitButtonProps?: Partial<ButtonProps>;
  actions?: React.ReactNode;
  disabled?: boolean;
};

const baseFieldClass =
  "block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-primary focus:ring-primary";

const getInitialValue = (field: FormFieldConfig, provided?: FormValues[string]) => {
  if (typeof provided !== "undefined") {
    return provided;
  }

  if (field.type === "checkbox") {
    return false;
  }

  return "";
};

export const Form: React.FC<FormProps> = ({
  fields,
  initialValues,
  onSubmit,
  onChange,
  submitLabel = "Submit",
  className = "",
  layout = "vertical",
  submitButtonProps,
  actions,
  disabled = false,
}) => {
  const [values, setValues] = React.useState<FormValues>(() => {
    return fields.reduce<FormValues>((acc, field) => {
      acc[field.name] = getInitialValue(field, initialValues?.[field.name]);
      return acc;
    }, {});
  });
  const [errors, setErrors] = React.useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const layoutClass =
    layout === "horizontal" ? "grid gap-6 md:grid-cols-2" : "flex flex-col gap-6";

  const resetForm = React.useCallback(() => {
    setValues(
      fields.reduce<FormValues>((acc, field) => {
        acc[field.name] = getInitialValue(field, initialValues?.[field.name]);
        return acc;
      }, {})
    );
    setErrors({});
  }, [fields, initialValues]);

  const runValidation = React.useCallback(
    (field: FormFieldConfig, value: FormValues[string]): string | undefined => {
      if (field.required) {
        const isEmpty =
          field.type === "checkbox" ? value !== true : value === "" || value === undefined;
        if (isEmpty) {
          return `${field.label} is required.`;
        }
      }

      if (field.validate) {
        return field.validate(value, values);
      }

      return undefined;
    },
    [values]
  );

  const handleFieldChange = (name: string, value: FormValues[string]) => {
    setValues(prev => {
      const next = { ...prev, [name]: value };
      onChange?.(next);
      return next;
    });
  };

  const handleBlur = (field: FormFieldConfig) => {
    const message = runValidation(field, values[field.name]);
    setErrors(prev => ({ ...prev, [field.name]: message }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationResults = fields.reduce<Record<string, string | undefined>>(
      (acc, field) => {
        acc[field.name] = runValidation(field, values[field.name]);
        return acc;
      },
      {}
    );

    setErrors(validationResults);
    const hasErrors = Object.values(validationResults).some(Boolean);

    if (hasErrors) {
      return;
    }

    try {
      setIsSubmitting(true);
      await Promise.resolve(onSubmit(values, { reset: resetForm }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldControl = (field: FormFieldConfig, value: FormValues[string], id: string) => {
    if (field.component) {
      return field.component({
        field,
        value,
        error: errors[field.name],
        id,
        onChange: updated => handleFieldChange(field.name, updated),
        onBlur: () => handleBlur(field),
      });
    }

    const commonProps = {
      id,
      name: field.name,
      onBlur: () => handleBlur(field),
      disabled: disabled,
      "aria-invalid": errors[field.name] ? "true" : undefined,
      "aria-describedby": errors[field.name] ? `${id}-error` : field.helperText ? `${id}-helper` : undefined,
    };

    if (field.type === "textarea") {
      return (
        <textarea
          {...commonProps}
          className={baseFieldClass}
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={event => handleFieldChange(field.name, event.target.value)}
          rows={4}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          {...commonProps}
          className={baseFieldClass}
          value={(value as string) ?? ""}
          onChange={event => handleFieldChange(field.name, event.target.value)}
        >
          <option value="" disabled>
            {field.placeholder ?? "Select an option"}
          </option>
          {field.options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "checkbox") {
      return (
        <div className="flex items-center gap-2">
          <input
            {...commonProps}
            type="checkbox"
            checked={Boolean(value)}
            onChange={event => handleFieldChange(field.name, event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
          />
          <label htmlFor={id} className="text-sm text-slate-700 font-medium">
            {field.label}
          </label>
        </div>
      );
    }

    return (
      <input
        {...commonProps}
        type={field.type}
        className={baseFieldClass}
        placeholder={field.placeholder}
        value={(value as string) ?? ""}
        onChange={event => handleFieldChange(field.name, event.target.value)}
      />
    );
  };

  return (
    <form
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className={layoutClass}>
        {fields.map(field => {
          const id = `form-${field.name}`;
          const value = values[field.name];
          const error = errors[field.name];

          return (
            <div key={field.name} className="flex flex-col gap-2">
              {field.type !== "checkbox" && (
                <div className="flex flex-col gap-1">
                  <label htmlFor={id} className="text-sm font-medium text-slate-700">
                    {field.label}
                    {field.required && <span className="text-danger">*</span>}
                  </label>
                  {field.description && (
                    <p className="text-xs text-slate-500">{field.description}</p>
                  )}
                </div>
              )}
              {renderFieldControl(field, value, id)}
              {field.helperText && !error && field.type !== "checkbox" && (
                <p id={`${id}-helper`} className="text-xs text-slate-500">
                  {field.helperText}
                </p>
              )}
              {error && (
                <p id={`${id}-error`} className="text-xs text-danger">
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {actions}
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={disabled}
          {...submitButtonProps}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

Form.displayName = "Form";
