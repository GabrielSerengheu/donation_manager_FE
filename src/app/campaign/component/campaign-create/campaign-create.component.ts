import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CampaignService} from "../../services/campaign.service";
import {LanguageService} from "../../../services/language.service";

@Component({
  selector: 'app-campaign-create',
  templateUrl: './campaign-create.component.html',
  styleUrls: ['./campaign-create.component.css']
})
export class CampaignCreateComponent implements OnInit {

  isSuccess: boolean = false;
  isDuplicate: boolean = false;
  campaignForm: FormGroup;
  translatedMessage: string = '';

  constructor(private formBuilder: FormBuilder,
              private campaignService: CampaignService,
              private languageService: LanguageService) {
    this.campaignForm = this.formBuilder.group( {
      name:['', Validators.required],
      purpose: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.campaignForm.valid) {
      const campaignData = this.campaignForm.value;
        this.campaignService.createCampaign(campaignData).subscribe(
          (response) => {
            console.log('Campaign created:', response);
            this.isSuccess = true;
            this.campaignForm.reset();
            this.campaignForm.controls['name'].setErrors(null);
            this.campaignForm.controls['purpose'].setErrors(null);
          },
          (error) => {
            console.error('Error creating campaign: ', error);
            this.isDuplicate = true;
          }
        );
      }
    else {
      this.campaignForm.markAllAsTouched();
    }
      this.clearBoolean();
  }

  clearBoolean(){
    this.isSuccess = false;
    this.isDuplicate = false;
  }

  ngOnInit(): void {
    this.languageService.selectedLanguage$.subscribe((language) => {
      // Fetch and set translated content based on the selected language
      this.translatedMessage = this.getTranslatedMessage(language);
    });
  }

  getErrorMessage() {
    if (this.campaignForm.hasError('required')) {
      return 'You must enter a value';
    }
    return this.campaignForm.hasError('name') ? 'Not a valid name' : '';
  }

  getTranslatedMessage(key: string): string {
    return this.languageService.getTranslation(key);
  }
}
