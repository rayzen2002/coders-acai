import dayjs from 'dayjs'
import { jsPDF as JsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { DateRange } from 'react-day-picker'

interface PDFDocument extends JsPDF {
  lastAutoTable?: {
    finalY?: number
  }
}

export async function pdfCreator(dateRange: DateRange | undefined) {
  const doc: PDFDocument = new JsPDF()
  let dateRangeString = 'No Date Range Selected'

  if (dateRange) {
    const startDate = dayjs(dateRange.from)
    const endDate = dayjs(dateRange.to)
    const startDateString = startDate.format('DD/MM/YYYY')
    const endDateString = endDate.format('DD/MM/YYYY')
    dateRangeString = `${startDateString} - ${endDateString}`

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_KEY}/metrics/month-revenue`,
    )
    const body = await response.json()

    // Filtrar os dados pela data dentro do intervalo
    const filteredData = body.filter((item: any) => {
      const itemDate = dayjs(item.date)
      return (
        itemDate.isAfter(startDate.subtract(1, 'day')) &&
        itemDate.isBefore(endDate.add(1, 'day'))
      )
    })

    const transformedData = filteredData.map((item: any) => [
      dayjs(item.date).format('DD/MM/YYYY'),
      `${item.revenue} R$`,
      `${item.cost} R$`,
    ])

    const responseMonth = await fetch(
      `${process.env.NEXT_PUBLIC_API_KEY}/metrics/month-total-revenue`,
    )
    const bodyMonth = await responseMonth.json()

    const keysToInclude = ['Data', 'Ganhos', 'Gastos']
    const monthRevenue = bodyMonth[1].revenue - bodyMonth[1].cost

    const responseCustomer = await fetch(
      `${process.env.NEXT_PUBLIC_API_KEY}/customers-card`,
    )
    const bodyCustomer = await responseCustomer.json()
    const transformedDataCustomers = bodyCustomer.map((item: any) => [
      item.name,
      `${item.produto} R$`,
      `${item.total} R$`,
    ])

    const responseProducts = await fetch(
      `${process.env.NEXT_PUBLIC_API_KEY}/products-card`,
    )
    const bodyProducts = await responseProducts.json()
    const transformedDataProducts = bodyProducts.map((item: any) => [
      item.product,
      item.amount,
    ])

    doc.text(`Período do Relatório: `, 10, 10)
    doc.text(`${dateRangeString} `, 70, 10)
    // doc.text(`${monthRevenue} R$`, 70, 20)
    autoTable(doc, {
      startY: 20,
      head: [['Receita no Período']],
      body: [[`${monthRevenue}R$`]],
    })
    console.log(transformedData)
    if (transformedData) {
      autoTable(doc, {
        startY: 35,
        head: [keysToInclude],
        body: transformedData,
      })
    }

    const startYProducts = (doc.lastAutoTable?.finalY || 10) + 20
    doc.text('Produtos Populares:', 10, startYProducts)
    autoTable(doc, {
      startY: startYProducts + 10,
      head: [['Produto', 'Quantidade']],
      body: transformedDataProducts,
    })

    const startYCustomers = (doc.lastAutoTable?.finalY || 10) + 20
    doc.text('Melhores Clientes:', 10, startYCustomers)
    autoTable(doc, {
      startY: startYCustomers + 10,
      head: [['Nome', 'Produto', 'Total']],
      body: transformedDataCustomers,
    })
  }

  doc.save('report.pdf')
}
