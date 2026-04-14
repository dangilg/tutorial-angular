export interface DeleteCheckResponse{
  canDelete: boolean,
  reason?: 'IN_USE' | 'PROTECTED' | ''
}
