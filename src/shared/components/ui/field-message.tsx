import { CircleAlert } from "lucide-react";

type FieldMessageProps = {
  id: string;
  children: string;
};

// The error under a field: icon plus text, announced when it appears.
export function FieldMessage({ id, children }: FieldMessageProps) {
  return (
    <p
      id={id}
      role="alert"
      className="flex items-start gap-1.5 text-caption font-semibold text-danger"
    >
      <CircleAlert aria-hidden="true" className="mt-px size-3.5 shrink-0" />
      {children}
    </p>
  );
}
