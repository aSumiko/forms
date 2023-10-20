import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {distinctUntilChanged, empty, map, Observable, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DropdownService} from "../shared/services/dropdown.service";
import {EstadoBr} from "../shared/models/estado-br";
import {ConsultaCepService} from "../shared/services/consulta-cep.service";
import {FormValidations} from "../shared/form-validations";
import {VerificaEmailService} from "./services/verifica-email.service";
import {tap} from "rxjs/operators";
import {BaseFormComponent} from "../shared/base-form/base-form.component";
import {Cidade} from "../shared/models/cidade";

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent extends BaseFormComponent implements OnInit{
  /*formulario!: FormGroup;*/
  endereco!: FormGroup;
  estados!: EstadoBr[];
  cidades!: Cidade[];

  //estados!: Observable<EstadoBr[]>;
  cargos?:any[];
  tecnologias?: any[];
  newsletterOp?: any[];
  frameworks = ['Angular', 'React', 'Vue', 'Sencha'];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService,
    private verificaEmailService: VerificaEmailService)

  {
    super();
  }


  ngOnInit() {
    //this.verificaEmailService.verificarEmail('email@email.com').subscribe();
    //this.estados = this.dropdownService.getEstadosBr();
    this.dropdownService.getEstadosBr()
      .subscribe((dados) => this.estados = dados);
    this.cargos = this.dropdownService.getCargos();
    this.tecnologias = this.dropdownService.getTecnologias();
    this.newsletterOp = this.dropdownService.getNewsletter();


   /* this.dropdownService.getEstadosBr()
      this.dropdownService.getEstadosBr().subscribe((dados: EstadoBr[])=>{
        this.estados = dados;
        console.log(this.estados)
      });*/
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
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10) ]],
      email: [null, [Validators.required, Validators.email], [this.validarEmail.bind(this)]],
      confirmarEmail: [null, FormValidations.equalsTo('email')],
      endereco: this.formBuilder.group({
        cep: [null,[Validators.required, FormValidations.cepValidator]],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      }),
      cargo: [null],
      tecnologias: [null],
      newsletter: ['s'],
      termos: [null, Validators.pattern('true')],
      frameworks: this.buildFrameworks()
    });

    this.formulario.get('endereco.cep')?.statusChanges
      .pipe(
        distinctUntilChanged(),
        tap((value:any) =>console.log('status CEP:', value)),
        switchMap((status:any) =>  status === 'VALID' ?
          this.cepService.consultaCEP(this.formulario.get('endereco.cep')?.value)
          : empty()
        )
      )
      .subscribe((dados:any) => dados ? this.populaDadosform(dados) : {});

    this.formulario.get('endereco.estado')?.valueChanges
      .pipe(
        tap((estado) => console.log('novo estado', estado)),
        map((estado) => this.estados.filter((e) => e.sigla === estado)),
        map((estados: any[]) => estados && estados.length > 0 ? estados[0].id : empty()
        ),
        switchMap((estadoId: number) => this.dropdownService.getCidades(estadoId)
        ),
        tap(console.log)
      )
      .subscribe((cidades) => this.cidades = cidades);

      //this.dropdownService.getCidades(8).subscribe(console.log);

    }


  buildFrameworks(){
    const values = this.frameworks.map(v => new FormControl(false));
    return this.formBuilder.array(values, FormValidations.requiredMinCheckbox(1));

  }

/*
  requiredMinCheckbox(min:number=1) {
    const validator: ValidatorFn = (formArray: AbstractControl) => {
    /!*  const values = formArray.controls;
      let totalChecked = 0;
      for(let i=0; i<values.length; i++){
        if (values[i].value){
          totalChecked += 1;
        }
      }
      return totalChecked >= min ? numm : { required: true };
      }
      return validator;
      *!/
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
*/
  submit() {
    console.log(this.formulario);

    let valueSubmit = Object.assign({}, this.formulario.value);

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
        .map((v:any, i:any) => v ? this.frameworks[i]: null)
        .filter((v:any) => v !== null)
    });
    this.http.post('https://httpbin.org/post', JSON.stringify(valueSubmit))
      .pipe(map((res:any)=> res)).subscribe({
      next: data => {
        console.log(data);
      },
      error: (error: any) => {
        alert('erro');
      }
    });

  }
  aplicaCssErro(campo: any) {
    return {
      'is-invalid': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    }
  }
  consultaCEP() {

    const cep = this.formulario.get('endereco.cep')?.value;
    console.log(cep);
    if (cep != null && !cep.isEmpty) {
      this.cepService.consultaCEP(cep)?.subscribe((dados:any) => {
        this.populaDadosform(dados);
      });
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

  setarCargo(){
    const cargo = {nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl'};
    this.formulario.get('cargo')?.setValue(cargo);
  }

  compararCargos(obj1:any, obj2:any){
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 === obj2;
  }
  setarTecnologias(){
    this.formulario.get('tecnologias')?.setValue(['java','php']);

  }
  getFrameworksControls() {
    return this.formulario.get('frameworks') ? (<FormArray>this.formulario.get('frameworks')).controls : null;
  }
  validarEmail(formControl: FormControl){
    return this.verificaEmailService.verificarEmail(formControl.value)
      .pipe(map((emailExiste => emailExiste ? { emailInvalido: true } : null )))
  }






}

class DataFormComponentImpl extends DataFormComponent {
}
