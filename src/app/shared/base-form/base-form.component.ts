import {Directive} from '@angular/core';
import {FormArray, FormGroup} from "@angular/forms";

@Directive()
export abstract class BaseFormComponent {
  formulario!: FormGroup;
  abstract submit():void;
  onSubmit() {
    if (this.formulario.valid) {
      this.submit();
    } else {
      console.log('form invalid');
      this.verificaValidacoesForm(this.formulario);
    }
  }
  verificaValidacoesForm(formGroup: FormGroup | FormArray){
    Object.keys(formGroup.controls).forEach(campo=>{
      console.log(campo);
      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      controle?.markAsTouched();
      if (controle instanceof  FormGroup || controle instanceof  FormArray){
        this.verificaValidacoesForm(controle)
      }
    })
  }
  resetar(){
    this.formulario.reset();
  }
  verificaValidTouched(campo: any) {
    return !this.formulario.get(campo)?.valid && this.formulario.get(campo)?.touched;
  }
  verificaRequired(campo: any) {
    return this.formulario.get(campo)?.hasError('required') && this.formulario.get(campo)?.touched;
  }
  verificaEmailInvalido() {
    let campoEmail = this.formulario.get('email');
    if(campoEmail?.errors){
      return campoEmail.errors?.['email'] && campoEmail.touched;
    }
  }
}
