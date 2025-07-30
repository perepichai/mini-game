import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-modal',
  imports: [MatDialogModule],
  templateUrl: './popup-modal.component.html',
  styleUrl: './popup-modal.component.scss'
})
export class PopupModalComponent {
  public readonly data = inject(MAT_DIALOG_DATA);
}
