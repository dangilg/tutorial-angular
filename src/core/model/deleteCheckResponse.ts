export interface DeleteCheckResponse{
  canDelete: boolean,
  reason?: 'EN USO' | 'PROTEGIDA' | 'EN PROCESO'|'',
  list?:{
    id:number,
    name:string
  }[]
}
