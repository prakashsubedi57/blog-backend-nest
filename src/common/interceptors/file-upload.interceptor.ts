import { FileInterceptor } from '@nestjs/platform-express';

export function FileUploadInterceptor(name:string) {
    return FileInterceptor(name);
}