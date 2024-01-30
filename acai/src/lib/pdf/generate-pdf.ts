import { jsPDF as JsPDF } from 'jspdf'

// Default export is a4 paper, portrait, using millimeters for units
export function pdfCreator() {
  const doc = new JsPDF()
  const data = [
    {
      $: ' ',
      ganhos: '500',
      gastos: '350',
      'n· de vendas': '20',
      'cliente do dia': 'Fulano',
    },
  ]
  const headers = ['$', 'ganhos', 'gastos', 'n· de vendas', 'cliente do dia']
  // doc.text('Hello world!', 10, 10)
  doc.table(5, 10, data, headers, { autoSize: true, padding: 10 })
  doc.save('a4.pdf')
}
