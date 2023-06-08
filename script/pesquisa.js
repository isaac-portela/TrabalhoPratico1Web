pesquisaProdutos = async (search) =>{
  try{
    const respose = await fetch('https://fakestoreapi.com/products')
    const json = await respose.json();
    const produtos = json;
    
    const resultados = produtos.filter(item => {
      // Realiza a pesquisa com base na variável de busca
      // Neste exemplo, a pesquisa é feita no campo 'title' dos produtos
      return item.title.toLowerCase().includes(search.toLowerCase());
    })
    
    return resultados;
  }
  catch(error){
    console.log('Ocorreu um erro ao obter os dados da API:', error);
  }
}

const filtroAvancado = async (categoria, precoIni, precoFim) => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const json = await response.json();
    let resultados = json;

    // Filtrar por categoria
    if (categoria) {
      resultados = resultados.filter(item => item.category === categoria);
    }

    // Filtrar por faixa de preço
    if (precoIni && precoFim) {
      resultados = resultados.filter(item => {
        const preco = parseFloat(item.price);
        return preco >= parseFloat(precoIni) && preco <= parseFloat(precoFim);
      });
    }
    
    return resultados;
  } catch (error) {
    console.log('Ocorreu um erro ao obter os dados da API:', error);
  }
}



const calculaQuantidadeEstrelas = (qtdEstrelas) =>{
  let documentStar = '<div class="estrelas">';
  for(let i = 0; i < 5; i++){
    if(i < qtdEstrelas)
    documentStar += `<span class="estrela preenchida"></span>`;  
    else
    documentStar += `<span class="estrela"></span>`;
  }
  
  documentStar += '</div>';
  
  return documentStar;
}

const getProdutos = async(filtro, search, categoria, precoIni, precoFim) =>{
  let resultados = [];
  if(search){
    resultados = await filtro(search);
  }
  else{
    resultados = await filtro(categoria, precoIni, precoFim);
  }
  let str = '';	
  if(resultados.length == 0){
    str = '<h2>Nenhum produto encontrado</h2>';
  }
  resultados.forEach(produto => {
        const qtdEstrelas = Math.round(produto.rating.rate);
        const strEstrelas = calculaQuantidadeEstrelas(qtdEstrelas);
        
        let precoProduto = produto.price * 1.10;
        precoProduto = precoProduto.toFixed(2);
        
        let valorProdutoDozeVezes =(precoProduto * 1.10) / 12;
        valorProdutoDozeVezes = valorProdutoDozeVezes.toFixed(2);
        str += `
          <div class="produto" onclick="redirecionarDetalhes('${produto.id}')">
            <img src="${produto.image}" alt="${produto.title}">
            <h3 class="title">${produto.title}</h3>
            ${strEstrelas}
            <p class="desc">${produto.description}</p>
            <p class="price">$ ${produto.price}</p>
            <span class="det-price"><strong>${precoProduto}</strong> ou <strong>12x</strong> de <strong>${valorProdutoDozeVezes}</strong></span>
            <span class="comprar-carrinho"><button>Comprar</button><button>Carrinho</button></span>
          </div>`
        });
    document.querySelector('.principais-produtos').innerHTML = str;
}

window.onload = () => { 
  const pesquisa = document.getElementById('pesquisa-geral');
  const btnPesquisa = document.querySelector('.btn-search');
  
  const urlParams = new URLSearchParams(window.location.search);
  
  if(urlParams.get('search') != null){
    const search = urlParams.get('search');
    pesquisa.value = search;
    getProdutos(pesquisaProdutos, search);
  }
  else{
    const categoria = urlParams.get('categoria');
    const precoIni = urlParams.get('precoIni');
    const precoFim = urlParams.get('precoFim');
    getProdutos(filtroAvancado, "", categoria, precoIni, precoFim);
  }
  
  pesquisa.addEventListener('keyup', (event) => {
    if(event.key === 'Enter'){
      const newUrl = window.location.pathname + '?search=' + pesquisa.value;
      history.pushState(null, null, newUrl);
      const search = pesquisa.value;
      getProdutos(pesquisaProdutos, search);
    }
  });
  
  btnPesquisa.addEventListener('click', () => {
    const selectCategoriaSelected = document.getElementById('filtro-categoria').value;
    const precoIni = document.getElementById('preco-ini').value;
    const precoFim = document.getElementById('preco-fim').value;
    
    if(precoIni !== '' && precoFim !== ''){
      if(precoIni > precoFim){
        alert('O preço inicial não pode ser maior que o preço final');
        return;
      }
    } 
    else{
      alert('Preencha os campos de preço');
      return;
    }
    
    const strSearch = `categoria=${selectCategoriaSelected}&precoIni=${precoIni}&precoFim=${precoFim}`;
    const newUrl = window.location.pathname + '?' + strSearch;
    history.pushState(null, null, newUrl);
    getProdutos(filtroAvancado, "", selectCategoriaSelected, precoIni, precoFim);
  }) 
}
