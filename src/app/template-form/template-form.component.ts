import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {ConsultaCepService} from "../shared/services/consulta-cep.service";

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent {
  constructor(private http: HttpClient,
  private cepService: ConsultaCepService) {
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
    cep = cep.replace(/\D/g, "");
    if (cep != null && cep ==! '') {
      this.cepService.consultaCEP(cep).subscribe((dados:any) => this.populaDadosform(dados, form));

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

