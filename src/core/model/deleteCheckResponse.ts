//Interface que gestiona el formato de la respuesta del Backend en relacióon con la comprobación de eiminación de un objeto

export interface DeleteCheckResponse{
  canDelete: boolean,
  //Razón de por que no se ouede eliminar.
  reason?: 'EN USO' | 'PROTEGIDA' | 'EN PROCESO'|'',
  //lista con los datos de los objetos en los que está.
  list?:{
    id:number,
    name:string
  }[]
}
