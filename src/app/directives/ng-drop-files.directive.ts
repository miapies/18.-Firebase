import { FileItem } from '../models/file-item';
import {
  Directive,
  EventEmitter,
  ElementRef,
  HostListener,
  Input,
  Output
} from '@angular/core';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  @HostListener('dragover', ['$event'])
  public onDragEnter(event: Event) {
    this.mouseSobre.emit(true);
    this._prevenirDetener(event);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: Event) {
    this.mouseSobre.emit(false);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: Event) {

    const transferencia = this._getTransferencia(event);
    if (!transferencia) {
      return;
    }

    this._extraerArchivos(transferencia.files);
    this._prevenirDetener(event);
    this.mouseSobre.emit(false);

  }

  // Para la compatibilidad entre navegadores para el drag and drop
  private _getTransferencia(event: any) {
    return event.dataTransfer ? event.dataTransfer
      : event.originalEvent.dataTransfer;
  }

  private _extraerArchivos(archivosLista: FileList) {
    // Una forma
    // for (const propiedad in archivosLista) {
    //   if (archivosLista.hasOwnProperty(propiedad)) {
    //     const archivoTemporal = archivosLista[propiedad];

    //   }
    // }

    // Otra forma
    // tslint:disable-next-line:forin
    for (const propiedad in Object.getOwnPropertyNames(archivosLista)) {
      const archivoTemporal = archivosLista[propiedad];
      if (this._archivoPuedeSerCargado(archivoTemporal)) {
        this.archivos.push(new FileItem(archivoTemporal));
      }
    }

    console.log(this.archivos);

  }


  // Validaciones
  private _archivoPuedeSerCargado(archivo: File): boolean {
    if (!this._archivoDroppeado(archivo.name)
      && this._esImagen(archivo.type)) {
      return true;
    } else {
      return false;
    }
  }

  private _prevenirDetener(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoDroppeado(nombreArchivo: string): boolean {

    for (const archivo of this.archivos) {
      if (archivo.nombreArchivo === nombreArchivo) {
        console.log('El archivo ' + nombreArchivo + ' ya se agregó');
        return true;
      }
    }

    return false;
  }

  private _esImagen(tipoArchivo: string): boolean {
    return (tipoArchivo === '' || tipoArchivo === undefined) ? false
      : tipoArchivo.startsWith('image');
  }

}
