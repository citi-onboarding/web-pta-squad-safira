import type { z } from "zod";

type ApiErrorOptions = {
  status: number;
  url: string;
  body: unknown;
  cause?: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly url: string;
  readonly body: unknown;

  constructor(message: string, options: ApiErrorOptions) {
    super(message, { cause: options.cause });
    this.name = "ApiError";
    this.status = options.status;
    this.url = options.url;
    this.body = options.body;
  }
}

type ApiContractErrorOptions = ApiErrorOptions & {
  issues: z.core.$ZodIssue[];
};

export class ApiContractError extends Error {
  readonly status: number;
  readonly url: string;
  readonly body: unknown;
  readonly issues: z.core.$ZodIssue[];

  constructor(message: string, options: ApiContractErrorOptions) {
    super(message, { cause: options.cause });
    this.name = "ApiContractError";
    this.status = options.status;
    this.url = options.url;
    this.body = options.body;
    this.issues = options.issues;
  }
}
