
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {CreateDonatorComponent} from "./donator/components/createDonator/createdonator.component";
import {DonatorListComponent} from "./donator/components/donator-list/donator-list.component";
import {EditDonatorComponent} from "./donator/components/edit-donator/edit-donator.component";
import {
  PermissionManagementRoutingModule
} from "./components/permission_management/permission-management-routing.module";
import {DonationRoutingModule} from "./donation/donation-routing.module";
import {UserRoutingModule} from "./user/user-routing.module";
import {CampaignRoutingModule} from "./campaign/campaign-routing.module";
import {DeleteDonatorComponent} from "./donator/components/delete-donator/delete-donator.component";
import {RightGuard} from "../../util/Guards/rights_guards";

const routes: Routes = [
  { path: 'donator/create', component: CreateDonatorComponent, canActivate: [RightGuard], data: {right:['BENEF_MANAGEMENT']} },
  { path: 'donator/edit', component: DonatorListComponent, canActivate: [RightGuard], data: {right:['BENEF_MANAGEMENT']} },
  { path: 'donator/edit/:id', component: EditDonatorComponent, canActivate: [RightGuard], data: {right:['BENEF_MANAGEMENT']} },
  { path: 'donator/delete', component: DeleteDonatorComponent, canActivate: [RightGuard], data: {right:['BENEF_MANAGEMENT']} },
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  // { path: '**', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PermissionManagementRoutingModule,
    DonationRoutingModule,
    UserRoutingModule,
    CampaignRoutingModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
