function gerar(pdf = false, imprimir = false) {
  
  const dataEmissao = document.getElementById('dataEmissao').value || new Date().toISOString().slice(0, 10);
  const observacoes = document.getElementById('observacoes').value;
  const assinSolicitante = document.getElementById('assinSolicitante').value;
  const assinAprovador = document.getElementById('assinAprovador').value;

  document.getElementById('relData').textContent = `Data de Emissão: ${dataEmissao}`;

  const tbody = document.getElementById('relItens');
  tbody.innerHTML = '';

  const descricoes = [...document.querySelectorAll('#itens-container .descricao')];
  const quantidades = [...document.querySelectorAll('#itens-container .quantidade')];
  const valoresUnitarios = [...document.querySelectorAll('#itens-container .valorUnitario')];

  let totalGeral = 0;

  for (let i = 0; i < descricoes.length; i++) {
    const desc = descricoes[i].value || '(vazio)';
    const qtd = parseInt(quantidades[i].value) || 0;
    const valorUnit = parseFloat(valoresUnitarios[i].value) || 0;

    const valorTotal = qtd * valorUnit;
    totalGeral += valorTotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:left;">${desc}</td>
      <td>${qtd}</td>
      <td>${valorUnit.toFixed(2).replace('.', ',')}</td>
      <td>${valorTotal.toFixed(2).replace('.', ',')}</td>
    `;
    tbody.appendChild(tr);
  }

  document.getElementById('valorTotalGeral').textContent = totalGeral.toFixed(2).replace('.', ',');

  document.getElementById('relObservacoes').textContent = observacoes || '-';
  document.getElementById('relAssinSolicitante').textContent = assinSolicitante || '_______________________';
  document.getElementById('relAssinAprovador').textContent = assinAprovador || '_______________________';

  const relatorio = document.getElementById('relatorio');
  relatorio.style.display = 'block';

  if (pdf) {
    const opt = {
      margin: 0.5,
      filename: 'pedido_compra_livraria.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(relatorio).save();
  } else if (imprimir) {
    const janela = window.open('', '_blank');
    janela.document.write('<html><head><title>Imprimir Pedido de Compra</title></head><body>');
    janela.document.write(relatorio.innerHTML);
    janela.document.write('</body></html>');
    janela.document.close();
    janela.focus();
    janela.print();
    janela.close();
  }
}
