const init = () => {
  const DEFAULT_CONFIG = {
    // 选择器
    selectors: '.markmap',
    // 是否隐藏原元素
    hide: true,
    // 位置：默认为 md 原位置后，可传 (el, svg) => {} 
    where: undefined,
    // mm 样式
    style: "width: 800px; height: 800px;"
  }
  
  const config = Object.assign({}, DEFAULT_CONFIG, window.markmapConfig)

  const {
    Transformer,
    Markmap,
    loadCSS, 
    loadJS
  } = window.markmap;

  const transform = (transformer, content) => {
    const { root, features } = transformer.transform(content)
    const { styles, scripts } = transformer.getUsedAssets(features);
    if (styles) loadCSS(styles);
    if (scripts) loadJS(scripts);
    return root
  }

  document.querySelectorAll(config.selectors)
    .forEach((el) => {
      // 设置 md 显示隐藏
      if (config.hide) el.setAttribute('style', 'display: none;')

      // 准备 svg 元素
      const $svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      $svg.setAttribute('style', config.style)
      if (typeof config.where === 'function') config.where(el, $svg)
      else el.parentNode.insertBefore($svg, el.nextSibling)
      
      // 执行渲染流程
      const lines = el.textContent.split('\n');
      let indent = Infinity;
      lines.forEach(line => {
        const spaces = line.match(/^\s*/)[0].length;
        if (spaces < line.length) indent = Math.min(indent, spaces);
      });
      const content = lines.map(line => line.slice(indent)).join('\n');
      const transformer = new Transformer();
      const mm = Markmap.create($svg);
      const render = () => {
        console.log('text', content)
        const root = transform(transformer, content)
        mm.setData(root)
        mm.fit();
      }
      transformer.hooks.retransform.tap(render);
      render();
    })
}

window.addEventListener('load', init);