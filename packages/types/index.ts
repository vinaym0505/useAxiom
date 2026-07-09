// Re-export all database generated types so that apps can use them without depending directly on Prisma if they choose not to.
export * from '@useaxiom/database';

// Add any additional shared types here
export interface CustomApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
