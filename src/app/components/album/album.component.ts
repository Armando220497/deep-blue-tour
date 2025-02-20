import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
  imports: [CommonModule, FormsModule],
})
export class AlbumComponent implements OnInit {
  albums: any[] = [];
  isCodeModalOpen: boolean = false;
  selectedAlbumId: number | null = null;
  code: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:5000/api/albums').subscribe(
      (response: any) => {
        this.albums = response;
      },
      (error) => {
        console.error('Errore durante il recupero degli album:', error);
      }
    );
  }

  openCodeModal(albumId: number): void {
    this.selectedAlbumId = albumId;
    this.isCodeModalOpen = true;
    this.code = '';
  }

  closeCodeModal(): void {
    this.isCodeModalOpen = false;
    this.selectedAlbumId = null;
    this.code = '';
  }

  downloadAlbum(): void {
    this.http
      .post<{ download_link: string }>(
        'http://localhost:5000/api/albums/download',
        {
          download_code: this.code,
        }
      )
      .subscribe(
        (response) => {
          const link = document.createElement('a');
          link.href = response.download_link;
          link.setAttribute('download', 'album.zip');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.closeCodeModal();
        },
        () => alert('Codice non valido! Riprova.')
      );
  }
}
