export interface DeleteCheckResponse{
  canDelete: boolean,
  reason?: 'EN USO' | 'PROTEGIDA' | '',
  list?:{
    id:number,
    name:string
  }[]
}
