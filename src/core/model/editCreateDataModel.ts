

//Interface que gestiona como debe ser el formato de los objetos Genéricos pasados a un modal de Edición/Creación
export interface editCreateDataModel<T>{
  //Objeto de tipo Genérico
  object:T;
  id:number;

  //True si es modo edición.
  editMode:boolean;
}
