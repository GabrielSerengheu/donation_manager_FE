import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DonationComponent} from "../components/donation/donation.component";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonModule} from "@angular/material/button";



@NgModule({
  declarations: [
    DonationComponent
  ],
    imports: [
        CommonModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatButtonModule
    ]
})
export class DonationModule { }
