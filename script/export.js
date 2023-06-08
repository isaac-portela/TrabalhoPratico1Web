export function calculaQuantidadeEstrelas(qtdEstrelas) {
  let documentStar = '<div class="estrelas">';
  for (let i = 0; i < 5; i++) {
    if (i < qtdEstrelas)
      documentStar += `<span class="estrela preenchida"></span>`;
    else
      documentStar += `<span class="estrela"></span>`;
  }
  
  documentStar += '</div>';
  
  return documentStar;
}
