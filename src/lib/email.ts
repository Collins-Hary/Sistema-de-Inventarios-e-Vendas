import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: false, 
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function enviarEmailAlertaStock(produtoNome: string, quantidade: number, minimo: number) {
  const mailOptions = {
    from: `"SoftNet Alerta" <${process.env.EMAIL_FROM}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `⚠️ Alerta de Stock Baixo: ${produtoNome}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 600px;">
        <h2 style="color: #dc2626;">⚠️ Alerta de Stock Crítico</h2>
        <p>O produto <strong>${produtoNome}</strong> atingiu o nível crítico configurado no sistema.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 16px;"><strong>Quantidade Atual:</strong> <span style="color: #dc2626; font-weight: bold;">${quantidade}</span></p>
        <p style="font-size: 16px;"><strong>Limite Mínimo:</strong> ${minimo}</p>
        <br />
        <p>Por favor, providencie a reposição deste item para evitar interrupções nas vendas.</p>
        <br />
        <p style="font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 10px;">
          Este é um email automático enviado pelo Sistema de Inventário SoftNet.
        </p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Email de alerta enviado: ${produtoNome}`)
  } catch (error) {
    console.error('Erro ao enviar email:', error)
  }
}