import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {TemplateFormComponent} from "./template-form.component";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [
    TemplateFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    ReactiveFormsModule
  ],

})
export class TemplateFormModule { }
