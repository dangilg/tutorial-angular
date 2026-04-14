import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DeleteCheckResponse } from "../model/deleteCheckResponse";
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-not-deleteable',
  imports: [
    MatButtonModule
  ],
  templateUrl: './notDeleteable.component.html',
  styleUrl:'./notDeleteable.component.scss'
})
export class NotDeleteableComponent implements OnInit{
  reason:String;
  text:String ='';
  constructor(
   public dialogRef: MatDialogRef<NotDeleteableComponent>,
   @Inject(MAT_DIALOG_DATA) public data:DeleteCheckResponse,
  ){}

  ngOnInit(){
    this.reason=this.data.reason;
    if(this.reason==''){
      this.reason='NOT_KNOWN';
    }
    this.text=`NO SE PUEDE ELIMINAR DEBIDO A: ${this.reason}`
  }

  onClose(){
    this.dialogRef.close();
  }
}
