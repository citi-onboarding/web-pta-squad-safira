import { useId } from "react";
import type { ComponentProps } from "react";

import { FieldMessage } from "./field-message";
import { Input } from "./input";

type TextFieldProps = Omit<ComponentProps<"input">, "id"> & {
  label: string;
  // Message shown under the field; it also marks the field invalid.
  error?: string;
  // Marks the field invalid when the message is shown elsewhere (e.g. a banner).
  invalid?: boolean;
};

export function TextField({ label, error, invalid, ...props }: TextFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-caption font-semibold text-foreground"
      >
        {label}
      </label>
      <Input
        id={id}
        aria-invalid={Boolean(error) || invalid || undefined}
        aria-describedby={error ? messageId : undefined}
        {...props}
      />
      {error ? <FieldMessage id={messageId}>{error}</FieldMessage> : null}
    </div>
  );
}
