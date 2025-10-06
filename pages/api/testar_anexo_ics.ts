import { NextApiRequest, NextApiResponse } from 'next';

/**
 * API de TESTE para verificar se o webhook suporta anexos ICS
 * 
 * Como usar:
 * POST /api/testar_anexo_ics
 * Body: { "email": "seu@email.com" }
 * 
 * Isso enviará um e-mail de teste com anexo ICS
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'E-mail é obrigatório' });
  }

  try {
    // Gerar um ICS de teste
    const dataHoje = new Date();
    const amanha = new Date(dataHoje);
    amanha.setDate(amanha.getDate() + 1);
    
    const dataFormatada = amanha.toISOString().split('T')[0].replace(/-/g, '');
    const horaInicio = '140000'; // 14:00
    const horaFim = '150000';    // 15:00

    const icsContent = `BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//Teste Intranet Plinio//NONSGML v1.0//PT\r
CALSCALE:GREGORIAN\r
METHOD:REQUEST\r
BEGIN:VEVENT\r
UID:teste-${Date.now()}@flecksteel.com.br\r
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\r
DTSTART:${dataFormatada}T${horaInicio}\r
DTEND:${dataFormatada}T${horaFim}\r
SUMMARY:🧪 TESTE - Anexo ICS\r
DESCRIPTION:Este é um teste para verificar se o anexo ICS funciona corretamente no seu e-mail.\r
LOCATION:Sala de Teste\r
STATUS:CONFIRMED\r
SEQUENCE:0\r
PRIORITY:5\r
ORGANIZER;CN=${email}:mailto:${email}\r
BEGIN:VALARM\r
TRIGGER:-PT15M\r
ACTION:DISPLAY\r
DESCRIPTION:Lembrete: Teste de anexo ICS\r
END:VALARM\r
END:VEVENT\r
END:VCALENDAR`;

    // Converter para base64
    const icsBase64 = Buffer.from(icsContent).toString('base64');

    // Mensagem HTML
    const mensagemHTML = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0066cc; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .info-box { background: #e7f3ff; border-left: 4px solid #0066cc; padding: 15px; margin: 15px 0; }
          .success { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 15px 0; }
          ul { list-style: none; padding-left: 0; }
          li { padding: 5px 0; }
          li:before { content: "✓ "; color: #28a745; font-weight: bold; }
          code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧪 Teste de Anexo ICS</h1>
          </div>
          <div class="content">
            <h2>Este é um e-mail de teste!</h2>
            
            <p>Se você está recebendo este e-mail, significa que o sistema de envio está funcionando.</p>
            
            <div class="info-box">
              <h3>📎 Anexo ICS</h3>
              <p>Um arquivo <code>reuniao.ics</code> foi anexado a este e-mail.</p>
              <p><strong>Evento de teste:</strong></p>
              <ul>
                <li>Título: 🧪 TESTE - Anexo ICS</li>
                <li>Data: Amanhã</li>
                <li>Horário: 14:00 - 15:00</li>
                <li>Local: Sala de Teste</li>
              </ul>
            </div>

            <div class="success">
              <h3>✅ Como verificar se funcionou:</h3>
              <ul>
                <li><strong>Gmail:</strong> Procure por um botão "Adicionar à agenda" ou clique no anexo .ics</li>
                <li><strong>Outlook:</strong> Clique no anexo reuniao.ics para adicionar ao calendário</li>
                <li><strong>Apple Mail:</strong> O convite deve aparecer automaticamente</li>
                <li><strong>Outros:</strong> Baixe o anexo .ics e abra com seu aplicativo de calendário</li>
              </ul>
            </div>

            <p><strong>Se você conseguir adicionar este evento à sua agenda, o sistema está funcionando corretamente! 🎉</strong></p>

            <hr>
            <p style="font-size: 12px; color: #666;">
              Este é um e-mail automático de teste do sistema de agendamento de salas.<br>
              Se você não solicitou este teste, pode ignorar esta mensagem.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Tentar enviar com anexo
    console.log('📤 Enviando e-mail de teste com anexo ICS...');
    
    const response = await fetch(process.env.WEBHOOK_NOTICIAS as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sendto: email,
        subject: '🧪 TESTE - Anexo ICS para Calendário',
        message: mensagemHTML,
        attachment: {
          filename: 'reuniao.ics',
          content: icsBase64,
          contentType: 'text/calendar; charset=utf-8; method=REQUEST'
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro do webhook:', errorText);
      return res.status(500).json({ 
        error: 'Erro ao enviar e-mail de teste',
        details: errorText,
        suggestion: 'O webhook pode não suportar o campo "attachment". Verifique a documentação do serviço de e-mail.'
      });
    }

    const result = await response.json();
    console.log('✅ E-mail de teste enviado com sucesso!');

    return res.status(200).json({ 
      success: true,
      message: 'E-mail de teste enviado com sucesso!',
      instructions: [
        '1. Verifique sua caixa de entrada',
        '2. Procure pelo e-mail com assunto "TESTE - Anexo ICS"',
        '3. Verifique se tem um anexo reuniao.ics',
        '4. Tente adicionar o evento à sua agenda',
        '5. Se funcionar, o sistema está OK! 🎉'
      ],
      recipient: email,
      webhookResponse: result
    });

  } catch (error) {
    console.error('❌ Erro ao enviar e-mail de teste:', error);
    return res.status(500).json({ 
      error: 'Erro ao enviar e-mail de teste',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      suggestion: 'Verifique se a variável WEBHOOK_NOTICIAS está configurada corretamente'
    });
  }
}
