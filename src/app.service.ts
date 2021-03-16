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
        margin : 10,
        with : 410
      })

      // customize your PDF document
      doc.rect(0, 20, doc.page.width , 120)
      .fillOpacity(0.8)
      .fill("blue", "#2F70B5")
      
      doc.font('Helvetica-Bold').fontSize(30)
      .fillColor('white').text('Seeyond Minvol Europe', 20,  50, {width : doc.page.width} ).moveDown()
  
      doc.font('Helvetica').fontSize(10)
      .fillColor('white').text('Toutes les données relatives à la performance en EUR - 29/01/2021', 20,  80,  {width : doc.page.width})
      
      doc.moveDown(10)


      doc.font('Helvetica').fontSize(15)
      .fillColor('black').fontSize(15)
      .fillColor('black').text('Points Clés', {
        width: 410,
        align: 'left'
        }
        ).moveDown()
        doc.font('Helvetica').fontSize(10)
        .fillColor('black').list(['Point 1', 'Point2', 'Point3'],{bulletIndent:20, textIndent:20});
      
        doc.rect(205, 205, doc.page.width , 120)
        .fillOpacity(0.8)
        .fill("white", "#2F70B5").fontSize(13)
        .fillColor('black').text(`Caractéristiques .....`, 395,205
        );
      
      
      
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
