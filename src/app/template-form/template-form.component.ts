import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent {
  constructor(private http: HttpClient) {
  }

  usuario: any = {
    nome: null,
    email: null
  }

  onSubmit(f: NgForm) {
    console.log(f);
    //console.log(this.usuario)
    this.http.post('https://httpbin.org/post', JSON.stringify(f.value)).pipe(map((res:any)=> res)).subscribe(dados => console.log(dados));

  }

  verificaValidTouched(campo: any) {
    return !campo.valid && campo.touched
  }

  aplicaCssErro(campo: any) {
    return {
      'is-invalid': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    }
  }

  consultaCEP(cep: any, form: NgForm) {
    cep = cep.replace(/\D/g, "")
    if (cep != "") {
      var validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {
        this.resetaDadosForm(form);
        this.http.get(`//viacep.com.br/ws/${cep}/json/`).pipe(map((dados: any) => dados)).subscribe((dados => this.populaDadosform(dados, form)));
      }
    }
  }


  populaDadosform(dados: any, formulario: NgForm) {
    /*    formulario.setValue({
          nome: formulario.value.nome,
          email: formulario.value.email,
          endereco: {
            rua: dados.logradouro,
            cep: dados.cep,
            numero: "",
            complemento: dados.complemento,
            bairro: dados.bairro,
            cidade: dados.localidade,
            estado: dados.uf


          }
        })*/

    formulario.form.patchValue({
      endereco: {
        rua: dados.logradouro,
        cep: dados.cep,
        numero: "",
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    })
  }

  resetaDadosForm(formulario: NgForm){
    formulario.form.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    })
  }
}
//.pipe(map((dados:any) => dados))
