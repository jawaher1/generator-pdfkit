import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit'


@Injectable()
export class AppService {
  
  getHello(): string {
    return 'Hello World!';
  }
  
  async generatePDF(): Promise<any> {
    const pdfBuffer: Buffer = await new Promise(resolve => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      })

      // customize your PDF document
      
      doc.text('This is a footer', 20, doc.page.height - 50, {
        lineBreak: false
      }).moveDown();
      doc.end()

      const buffer = []
      doc.on('data', buffer.push.bind(buffer))
      doc.on('end', () => {
        const data = Buffer.concat(buffer)
        resolve(data)
      })
    })

     return pdfBuffer
    
  }
}
