import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '../services/file-upload.service';

export function FileUploadInterceptor(destination: string) {
    return FileInterceptor('image', FileUploadService.getStorageOptions(destination));
}

