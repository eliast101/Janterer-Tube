import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MastHeadComponent } from './components/mast-head/mast-head.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { MainSectionComponent } from './components/main-section/main-section.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { VideoUploadFormComponent } from './components/main-section/video-upload-form/video-upload-form.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ValueMatchingDirective } from './directives/value-matching.directive';
import { AlreadyExistsValidatorDirective } from './directives/already-exists-validator.directive';
import { WatchComponent } from './components/main-section/watch/watch.component';
import { VideoPlayerComponent } from './components/main-section/watch/video-player/video-player.component';
import { VideoInfoComponent } from './components/main-section/watch/video-info/video-info.component';
import { VideoInfoControlsComponent } from './components/main-section/watch/video-info/video-info-controls/video-info-controls.component';
import { ButtonProviderComponent } from './components/shared/button-provider/button-provider.component';
import { UserProfileButtonComponent } from './components/shared/user-profile-button/user-profile-button.component';
import { CommentSectionComponent } from './components/main-section/watch/video-info/comment-section/comment-section.component';
import { CommentFormComponent } from './components/main-section/watch/video-info/comment-section/comment-form/comment-form.component';
import { CommentComponent } from './components/main-section/watch/video-info/comment-section/comment/comment.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    MastHeadComponent,
    SideNavComponent,
    MainSectionComponent,
    VideoUploadFormComponent,
    SigninComponent,
    SignUpComponent,
    ValueMatchingDirective,
    AlreadyExistsValidatorDirective,
    WatchComponent,
    VideoPlayerComponent,
    VideoInfoComponent,
    VideoInfoControlsComponent,
    ButtonProviderComponent,
    UserProfileButtonComponent,
    CommentSectionComponent,
    CommentFormComponent,
    CommentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
