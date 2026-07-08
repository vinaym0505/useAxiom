export interface IProject {
  id: string;
  organization_id: string;
  manager_id?: string | null;
  name: string;
  objective: string;
  status: string;
  target_deadline: Date;
  created_at: Date;
  deleted_at?: Date | null;
}

export interface IProjectCreateDto {
  name: string;
  objective: string;
  target_deadline: string; // ISO Date String
}

export interface IProjectUpdateDto {
  name?: string;
  objective?: string;
  target_deadline?: string;
  status?: string;
}
