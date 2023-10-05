import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {FormDebugComponent} from "./form-debug/form-debug.component";
import {CampoControlErroComponent} from "./campo-control-erro/campo-control-erro.component";
import {DropdownService} from "./services/dropdown.service";
@NgModule({
  declarations: [
    FormDebugComponent,
    CampoControlErroComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],

  exports:[
    FormDebugComponent,
    CampoControlErroComponent,
  ],
  providers: [DropdownService]
})
export class SharedModule{ }
