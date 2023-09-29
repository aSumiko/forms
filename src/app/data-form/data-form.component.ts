import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {map} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit{
  formulario!: FormGroup;
  endereco!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient) {
  }

  ngOnInit(): void{
/*    this.formulario = new FormGroup<any>({
      nome: new FormControl(null),
      email: new FormControl(null)
      endereço: new FormControl({
        cep: new FormControl(null)
        numero: new FormControl(null),
        complemento: new FormControl(null),
        rua: new FormControl(null),
        bairro: new FormControl(null),
        cidade: new FormControl(null),
        estado: new FormControl(null)

      )}

    });*/

    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      })
    })
  }

  onSubmit(){
    console.log(this.formulario)
    ''
    this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
      .pipe(map((res:any)=> res)).subscribe({
      next: data => {
        console.log(data);
        //this.formulario.reset()
        this.resetar();
      },
      error: (error: any) => {
        alert('erro');
      }
    });
  }

  resetar(){
    this.formulario.reset();
  }

  aplicaCssErro(campo: any) {
    return {
      'is-invalid': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    }
  }
  verificaValidTouched(campo: any) {
    return !this.formulario.get(campo)?.valid && this.formulario.get(campo)?.touched;
  }

  verificaEmailInvalido() {
    let campoEmail = this.formulario.get('email');
    if(campoEmail?.errors){
      return campoEmail.errors?.['email'] && campoEmail.touched;
    }
      }

  consultaCEP() {
    let cep = this.formulario.get('endereco.cep')?.value;
    cep = cep.replace(/\D/g, "");
    if (cep != "") {
      var validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {
       this.resetaDadosForm();
        this.http.get(`//viacep.com.br/ws/${cep}/json/`)
          .pipe(map((dados: any) => dados))
          .subscribe((dados => this.populaDadosform(dados)));
      }
    }
  }

  populaDadosform(dados: any) {
    this.formulario.patchValue({
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

  resetaDadosForm(){
    this.formulario.patchValue({
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
