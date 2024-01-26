import { jsPDF as JsPDF } from 'jspdf'

// Default export is a4 paper, portrait, using millimeters for units
export function pdfCreator() {
  const doc = new JsPDF()

  doc.text('Hello world!', 10, 10)
  doc.save('a4.pdf')
}
