import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
  imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
  ],
})
export class DashboardAdminComponent {
  newAlbum = {
    title: '',
    date: '',
    image_url: '',
    download_code: '',
    download_link: '',
  };

  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        return resolve('');
      }

      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.http
        .post<{ imageUrl: string }>(
          'http://localhost:5000/api/upload',
          formData
        )
        .subscribe(
          (response) => resolve(response.imageUrl),
          (error) => reject(error)
        );
    });
  }

  async createAlbum() {
    try {
      this.newAlbum.image_url = await this.uploadImage();

      this.http
        .post('http://localhost:5000/api/albums', this.newAlbum)
        .subscribe(
          () => {
            alert('Album creato con successo!');
            this.newAlbum = {
              title: '',
              date: '',
              image_url: '',
              download_code: '',
              download_link: '',
            };
            this.selectedFile = null;
          },
          (error) => {
            alert('Errore nella creazione dell’album!');
            console.error(error);
          }
        );
    } catch (error) {
      alert('Errore nel caricamento dell’immagine!');
      console.error(error);
    }
  }
}
