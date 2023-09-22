import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent {
  usuario: any = {
    nome: null,
    email: null
  }

  onSubmit(f: NgForm){
    console.log(f);
    //onsole.log(this.usuario)

  }
  verificaValidTouched(campo:any){
    return !campo.valid && campo.touched
  }

  aplicaCssErro(campo:any){
    return {
      'is-invalid': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    }
  }

}
