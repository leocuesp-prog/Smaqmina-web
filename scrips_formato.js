const LABORES = [
  "TUNEL 1","TUNEL 2","TUNEL 3",
  "CRUZADA DE GALERIA 1","GALERIA 2 CENTRO","GALERIA 2 NORTE","GALERIA 2 SUR",
  "TRANSVERSAL NORTE","TRANSVERSAL SUR",
  "GALERIA 3 CENTRO","GALERIA 3 SUR","GALERIA 3 NORTE","CRUZADA DE GALERIA 33",
  "DIAGONAL NORTE","DIAGONAL SUR","GALERIA 4"
];
const GASES = ['o2','ch4','co2','co','h2s','no2'];

// Store X state
const state = {};
LABORES.forEach((_, i) => {
  state[i] = {};
  GASES.forEach(g => state[i][g] = false);
});

function toggleX(row, gas) {
  state[row][gas] = !state[row][gas];
  const box = document.getElementById(`x_${row}_${gas}`);
  box.classList.toggle('marked', state[row][gas]);
  box.textContent = state[row][gas] ? 'X' : '';
}

function buildTable() {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';
  LABORES.forEach((labor, i) => {
    const tr = document.createElement('tr');
    const gasBoxes = GASES.map(g =>
      `<td class="td-check"><div class="x-box" id="x_${i}_${g}" onclick="toggleX(${i},'${g}')"></div></td>`
    ).join('');
    tr.innerHTML = `
      <td class="td-no">${i + 1}</td>
      <td class="td-labor">${labor}</td>
      ${gasBoxes}
      <td><input type="time" id="hora_${i}" /></td>
      <td><input type="text" id="resp_${i}" placeholder="Nombre" /></td>
      <td><input type="text" class="obs-in" id="obs_${i}" placeholder="..." /></td>
    `;
    tbody.appendChild(tr);
  });
}

function v(id) {
  return document.getElementById(id)?.value || '';
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function clearForm() {
  document.querySelectorAll('input').forEach(inp => {
    if (inp.id === 'anio') inp.value = '2026';
    else if (inp.id === 'lugar') inp.value = 'Mina Didáctica Sena';
    else inp.value = '';
  });
  document.getElementById('turno').value = '';
  LABORES.forEach((_, i) => GASES.forEach(g => {
    state[i][g] = false;
    const b = document.getElementById(`x_${i}_${g}`);
    b.classList.remove('marked');
    b.textContent = '';
  }));
  showToast('✓ Formulario limpiado');
}

function downloadPDF() {
  showToast('⚙ Abriendo vista de impresión...');
  setTimeout(() => window.print(), 400);
}

function downloadExcel() {
  const wb = XLSX.utils.book_new();
  const fecha = `${v('dia') || '?'}/${v('mes') || '?'}/${v('anio') || '?'}`;
  const wsData = [
    ['FORMATO MEDICIÓN DE GASES - MINA DIDÁCTICA SENA'],
    [`Lugar: ${v('lugar')}`, '', `Fecha: ${fecha}`, '', `Hora ingreso: ${v('hora')}`, '', `Turno: ${v('turno')}`],
    [],
    ['No', 'Labor', 'O₂ (X)', 'CH₄ (X)', 'CO₂ (X)', 'CO (X)', 'H₂S (X)', 'NO₂ (X)', 'Hora', 'Responsable', 'Observaciones']
  ];
  LABORES.forEach((labor, i) => {
    wsData.push([
      i + 1, labor,
      state[i].o2 ? 'X' : '', state[i].ch4 ? 'X' : '', state[i].co2 ? 'X' : '',
      state[i].co ? 'X' : '', state[i].h2s ? 'X' : '', state[i].no2 ? 'X' : '',
      v(`hora_${i}`), v(`resp_${i}`), v(`obs_${i}`)
    ]);
  });
  wsData.push([]);
  wsData.push(['VLP - Valores Límites Permisibles (X = supera el límite)']);
  wsData.push(['CH₄ 1%', 'CO₂ 0.5%', 'CO 25 PPM', 'H₂S 1 PPM', 'NO₂ 0.2 PPM']);
  wsData.push(['O₂ mínimo 19.5% — máximo 23.5%']);
  wsData.push([]);
  wsData.push([`Jefe de Mina: ${v('firmaJefe')}`, '', '', `Líder SST: ${v('firmaLider')}`]);
  wsData.push(['GOR-F-012 V03']);

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = [
    { wch: 5 }, { wch: 26 }, { wch: 7 }, { wch: 7 }, { wch: 7 },
    { wch: 7 }, { wch: 7 }, { wch: 7 }, { wch: 8 }, { wch: 22 }, { wch: 34 }
  ];
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 10 } }];
  XLSX.utils.book_append_sheet(wb, ws, 'Medición Gases');
  XLSX.writeFile(wb, `medicion_gases_${v('anio')}_${String(v('mes')).padStart(2, '0')}_${String(v('dia')).padStart(2, '0')}.xlsx`);
  showToast('✓ Excel descargado');
}

buildTable();
// =============================
// ACCESIBILIDAD
// =============================