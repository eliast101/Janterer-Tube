import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VideoUploadFormComponent} from "./components/main-section/video-upload-form/video-upload-form.component";
import {SigninComponent} from "./components/signin/signin.component";
import {SignUpComponent} from "./components/sign-up/sign-up.component";
import {WatchComponent} from "./components/main-section/watch/watch.component";
import {MainSectionComponent} from "./components/main-section/main-section.component";
import {VideoPlayerComponent} from "./components/main-section/watch/video-player/video-player.component";
import {VideoInfoComponent} from "./components/main-section/watch/video-info/video-info.component";

const routes: Routes = [
  {
    path: '',
    component: MainSectionComponent,
    children:
      [
        {path: 'watch/:id', component: WatchComponent, children:
            [
              {path: '', component: VideoPlayerComponent},
              {path: '', component: VideoInfoComponent}
            ]
        },
        {path: 'upload', component: VideoUploadFormComponent}
      ]
  },
  {path: 'signin', component: SigninComponent},
  {path: 'signup', component: SignUpComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
