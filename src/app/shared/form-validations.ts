import {AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn} from "@angular/forms";

export class FormValidations {

  static  requiredMinCheckbox(min:number=1) {
    const validator: ValidatorFn = (formArray: AbstractControl) => {
      if(formArray instanceof FormArray){
        const totalChecked = formArray.controls
          .map(v => v.value)
          .reduce((total, current) => current ? total + current : total, 0);
        return totalChecked >= min ? null : {required:true};

      }
      throw new Error('formArray is not an instance of FormArray')

    };
    return validator;
  }


  static cepValidator(control: FormControl){
    const cep = control.value;
    if(cep != null && !cep.isEmpty){
      const validacep =  /^[0-9]{5}-[0-9]{3}$/;
      return validacep.test(cep) ? null : { cepInvalido : true };
    }
    return null;
  }

  static equalsTo (otherField: string){
    const validator: ValidatorFn =  (formControl: AbstractControl) => {
      if (otherField == null) {
        throw new Error('É necessário informar um campo');
      }

      if (!formControl.root || !(<FormGroup>formControl.root).controls) {
        return null;
      }

      const field = (<FormGroup>formControl.root).get(otherField);
      if (!field) {
        throw new Error('É necessário informar um campo válido');
      }
      if (field.value !== formControl.value) {
        return {equalsTo: true};
      }
      return null;
    };
    return validator;
  }

  static getErrorMsg(fieldName: string, validatorName: string, validatorValue: any){
    const config: {[key:string]:any} = {
      'required':`${fieldName} é obrigatório.`,
      'minlength': `${fieldName} precisa ter de no mínimo ${validatorValue.requiredLength} caracteres.`,
      'maxlength': `${fieldName} precisa ter de no máximo ${validatorValue.requiredLength} caracteres.`,
      'cepInvalido': 'CEP inválido.',
      'emailInvalido': 'Email já cadastrado!',
      'equalTo': 'Campos não são iguais',
      'pattern': 'Campo Inválido'
    };
    return config[validatorName];
  }

}

