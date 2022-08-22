import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {AppConstant} from "../constants/AppConstant";
import {Observable} from "rxjs";
import {FileUploadResponse} from "../model/FileUploadResponse";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  headerOptions = {headers: new HttpHeaders({'Content-Type': 'multipart/form-data'})};

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<FileUploadResponse>(AppConstant.FILE_UPLOAD_API_URL, formData);
  }
}
