import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit'


@Injectable()
export class AppService {
  items = [
    {
      item: 'TC 100',
      description: 'Toner Cartridge',
      quantity: 2,
      amount: 6000,
    },
    {
      item: 'USB_EXT',
      description: 'USB Cable Extender',
      quantity: 1,
      amount: 2000,
    },
  ];
  generatedivs(doc, y, divs, height,colors) {
    const TopPosition = doc.y + 20
    var leftpos = 10
    var wi = doc.page.width / divs.length
    for (let i = 0; i < divs.length; i++) {
      const item = divs[i];
      
      doc.rect(leftpos, TopPosition, wi-20, height).fillOpacity(0.8).fill(colors[i]).text(item, leftpos, TopPosition)
      leftpos = leftpos + wi
      doc.y = doc.y + height
  
    }
  }

  generateTableRow(doc, y, c1, c2, c3, c4, c5) {
    doc
      .fontSize(10).fillColor('black')
      .text(c1, 50, y)
      .text(c2, 150, y)
      .text(c3, 280, y, { width: 90, align: 'right' })
      .text(c4, 370, y, { width: 90, align: 'right' })
      .text(c5, 0, y, { align: 'right' });
  }

  generateHeader(doc) {
    doc
      .image("src/assets/logo.png", 50, 45, { width: 50 })
      .fillColor('#444444')
      .fontSize(20)
      .text('Invoice', 110, 57)
      .fontSize(10)
      .text('Tunis', 200, 65, { align: 'right' })
      .text('TN 1053', 200, 80, { align: 'right' })
      .moveDown();
  }

  generateFooter(doc) {
    doc.fillColor('black')
      .fontSize(10)
      .text('This is a Footer', 50, doc.page.height - 50, { align: 'center', width: 500 , height: 50});
  }
  generateInvoiceTable(doc, items) {
    let i,
      invoiceTableTop = doc.y + 40;

    for (i = 0; i < items.length; i++) {
      const item = items[i];
      const position = invoiceTableTop + (i + 1) * 30;
      this.generateTableRow(
        doc,
        position,
        item.item,
        item.description,
        item.amount / item.quantity,
        item.quantity,
        item.amount,
      );
    }
  }

  async generatePDF(): Promise<any> {

    const pdfBuffer: Buffer = await new Promise(resolve => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      
        margins: {
          top: 50,
          bottom: 50,
          left: 10,
          right: 10
        }
       
      })
      this.generateHeader(doc);
      doc.rect(0, doc.y + 20, doc.page.width, 120)
        .fillOpacity(0.8)
        .fill("blue")

      doc.font('Helvetica-Bold').fontSize(30)
        .fillColor('white').text('Seeyond Minvol Europe', 20, doc.y + 50, { width: doc.page.width }).moveDown()

      doc.font('Helvetica').fontSize(10)
        .fillColor('white').text('Toutes les données relatives à la performance en EUR - 29/01/2021', 20, 190, { width: doc.page.width })


      this.generateInvoiceTable(doc, this.items)
      this.generatedivs(doc, doc.y, ["hello", "world"], 150, ["grey","#010101"])
      this.generatedivs(doc, 0, ["hello", "world", "hello","world"], 150, ["grey","#010101","grey","#010101"])
      doc.text('',doc.x,doc.y)
      console.log(doc.y)
      if (doc.y > 650) {
        this.generateFooter(doc)
        doc.addPage();
        
        doc.y = 50
     }
      this.generatedivs(doc, doc.y, ["hello", "world", "123!"], 150, ["grey","#010101","grey"])
      


      /*
            doc.font('Helvetica').fontSize(15)
              .fillColor('black').fontSize(15)
              .fillColor('black').text('Points Clés', {
                width: 410,
                align: 'left'
              }
              ).moveDown()
            doc.font('Helvetica').fontSize(10).fillColor('black').list(['Point 1', 'Point2', 'Point3']);
      
            doc.rect(275, 205, doc.page.width / 2, 120)
              .fill("grey").fontSize(13)
              .fillColor('black').text(`Caractéristiques .....`, 395, 205
              ).moveDown(2)
            doc.text('', 290, 50)
            doc.rect(doc.x + 10, 235, 100, doc.y)
              .fillOpacity(0.8)
              .fill("blue").fontSize(13)
              .fillColor('white').text(`bla bla`, 310, doc.x + 15
              );*/





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
